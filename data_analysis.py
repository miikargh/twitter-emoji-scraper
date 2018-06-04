import pandas as pd

df = pd.read_json('./tweet_json.backup.txt', lines=True)
print(df.shape)
print(df['text'].isnull().sum())
print(df[0])
