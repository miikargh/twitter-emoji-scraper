import re
import pandas as pd
import json
from pprint import pprint

# df = pd.read_json('./tweet_json.backup.txt', lines=True)
# print(df.shape)
# print(df['text'].isnull().sum())
# print(df[0])

with open('./tweet_json.backup.txt', 'r') as f:
    tweets = [json.loads(t) for t in f.readlines()]

with open('./emojis.txt', 'r') as f:
    emojis = f.read().split(',')

def extract_emojis(text):
    ''' Extracts emojis from text. '''
    return [e for e in emojis if e in text]

dataset = []
for i, t in enumerate(tweets):
    text = t['extended_tweet']['full_text'] if t['truncated'] else t['text']

    # Remove line breaks
    text = text.replace('\n', ' ').replace('\r', ' ')

    # Remove links
    text = re.sub(r'http\S+', '', text)

    # Extract emojis
    emos = extract_emojis(text)

    # Remove non alphanumerics but leave spaces
    text = re.sub(r'([^\s\w]|_)+', '', text)
    print(text, emos, len(emos))
    print('---------------------------------------------')

    if emos:
        dataset.append({
            'text': text,
            'emojis': ','.join(emos)
        })

    # print(text)
    if i > 20:
        break

with open('tweet_emoji_dataset.txt', 'w+', encoding='utf8') as f:
    for d in dataset:
        j = json.dumps(d, ensure_ascii=False)
        f.write(j + '\n')
