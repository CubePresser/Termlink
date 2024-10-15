import json

dictionary = {}

with open(r"dictionary.txt") as openfile:
  for word in openfile:
    strWord = word.strip()
    length = len(strWord)

    if not(4 <= length and length <= 15):
      continue

    strLength = str(length)
    
    words = dictionary.get(strLength, [])
    words.append(strWord)

    dictionary.update({strLength:words})

openfile.close()


with open('dictionary.json', 'w', encoding='utf-8') as result:
  json.dump(dictionary, result, ensure_ascii=False, indent=2, sort_keys=True)