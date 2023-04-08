import sys
import jieba

text = sys.stdin.read()

ls = jieba.cut(text)

print(ls)