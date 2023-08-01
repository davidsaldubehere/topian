import requests
user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36"
url = "https://rr1---sn-uhvcpax0n5-2ias.googlevideo.com/videoplayback?expire=1658650115&ei=oqncYqj5MsuH_9EPwa-4-Ao&ip=2607%3Afb90%3A374%3A34f5%3A9d7b%3Ac4ac%3Aa009%3A3929&id=o-AO21XnWKM43lp8yoLY2KdyUkgPl4hT1lz_xVuhM-E596&itag=251&source=youtube&requiressl=yes&mh=C7&mm=31%2C29&mn=sn-uhvcpax0n5-2ias%2Csn-p5qlsndz&ms=au%2Crdu&mv=m&mvi=1&pl=46&gcr=us&initcwndbps=281250&spc=lT-KhhKFhT1HrsYrC8q5QDelAfdvG70&vprv=1&mime=audio%2Fwebm&ns=GIRP6G_5dc0z9iW1sHhTMpcH&gir=yes&clen=4003459&dur=250.301&lmt=1584526654938841&mt=1658628054&fvip=2&keepalive=yes&fexp=24001373%2C24007246&c=WEB&txp=2311222&n=Jyl4iTs2eBH7iHq&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cgcr%2Cspc%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIhAMHeKxNXnx5Ji6F_8KS6mKQnMlhCU41_nbEOPfoXqFeNAiAgLZ6Tha_hU_sIU-q4BXryrGtCDfYB8LaWrq3bZ1YX3w%3D%3D&ratebypass=yes&sig=AOq0QJ8wRQIgS_fmO8FlCH9lVMhkpSx2J8IoYq5-wQCRbgLhsU_CQAQCIQCgUmEfID8zm9dpHG94XKsHDoH8SrrXsPq0aIrC48Tm7Q%3D%3D"

#send a request to the url using the user_agent
headers = {"User-Agent": user_agent}
response = requests.get(url, headers=headers)
print(response.status_code)