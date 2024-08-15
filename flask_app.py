from flask import Flask, request, jsonify
from prompt_model import Encoder, EncoderLayer, PositionwiseFeedforwardLayer, MultiHeadAttentionLayer, Decoder, DecoderLayer, Seq2Seq
from colorama import Fore, Style, init
from torchtext.data import Field
from tokenize import tokenize, untokenize
import pickle
import spacy
import torch
from dotenv import load_dotenv

# Loading the Model and Vocabulary Files
try:
    model = torch.load('./models/conversational-ai-model-cpu.pt',
                       map_location=torch.device('cpu'))
    print(f"{Fore.LIGHTGREEN_EX}\n> Model fetched successfully{Style.RESET_ALL}")

    with open('./vocabs/source_vocab.pkl', 'rb') as f:
        src_vocab = pickle.load(f)
    print(f"{Fore.LIGHTGREEN_EX}> Source Vocabulary loaded successfully{Style.RESET_ALL}")
    with open('./vocabs/target_vocab.pkl', 'rb') as f:
        trg_vocab = pickle.load(f)
    print(f"{Fore.LIGHTGREEN_EX}> Target Vocabulary loaded successfully{Style.RESET_ALL}")
except Exception as e:
    print(f"{Fore.RED}Error in fetching the model : {e} \n{Style.RESET_ALL}")


# Source (prompt questions) and Target (python codes) Vocabularies
SRC = Field(tokenize=lambda x: x.split(),
            init_token='<sos>',
            eos_token='<eos>',
            lower=True)

TRG = Field(tokenize=lambda x: x.split(),
            init_token='<sos>',
            eos_token='<eos>',
            lower=True)
SRC.vocab = src_vocab
TRG.vocab = trg_vocab


# System GPU is available or not
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')


# Convert the prompt to tokens and tensors, apply the model for code generation
def translate_sentence(sentence, src_field, trg_field, model, device, max_len=50000):
    model.eval()
    if isinstance(sentence, str):
        nlp = spacy.load('en')
        tokens = [token.text.lower() for token in nlp(sentence)]
    else:
        tokens = [token.lower() for token in sentence]

    tokens = [src_field.init_token] + tokens + [src_field.eos_token]
    src_indexes = [src_field.vocab.stoi[token] for token in tokens]

    src_tensor = torch.LongTensor(src_indexes).unsqueeze(0).to(device)
    src_mask = model.make_src_mask(src_tensor)

    with torch.no_grad():
        enc_src = model.encoder(src_tensor, src_mask)
    trg_indexes = [trg_field.vocab.stoi[trg_field.init_token]]

    for _ in range(max_len):
        trg_tensor = torch.LongTensor(trg_indexes).unsqueeze(0).to(device)
        trg_mask = model.make_trg_mask(trg_tensor)
        with torch.no_grad():
            output, attention = model.decoder(
                trg_tensor, enc_src, trg_mask, src_mask)
        pred_token = output.argmax(2)[:, -1].item()
        trg_indexes.append(pred_token)
        if pred_token == trg_field.vocab.stoi[trg_field.eos_token]:
            break

    trg_tokens = [trg_field.vocab.itos[i] for i in trg_indexes]
    return trg_tokens[1:], attention


# Function to generate code from user prompt
def eng_to_python(src):
    src = src.split(" ")
    translation, _ = translate_sentence(src, SRC, TRG, model, device)
    return untokenize(translation[:-1]).decode('utf-8')


app = Flask(__name__)


@app.route('/generate-code', methods=['POST'])
def generate_code():
    data = request.json
    prompt = data.get('prompt')
    try:
        generated_code = eng_to_python(prompt)
        print(
            f"{Fore.LIGHTBLUE_EX}\nGENERATED CODE : \n {Style.RESET_ALL}")
    except Exception as e:
        print(f"{Fore.RED}ERROR GENERATING PROMPT : {Style.RESET_ALL}", e)
    return jsonify({'code': generated_code})


if __name__ == '__main__':
    app.run(debug=True)
