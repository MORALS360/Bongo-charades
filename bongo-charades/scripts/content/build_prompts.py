#!/usr/bin/env python3
# Bongo Charades — prompt bank source (pre-Phase 5).
#
# This file is the human-friendly SOURCE of the prompt bank. Edit the lists below,
# then run from the project folder:
#     python3 scripts/content/build_prompts.py
# It rewrites ONLY the PROMPTS array inside src/data/prompts.ts, then run `npm test`
# to validate (duplicates, language rules, minimum counts).
#
# Generates src/data/prompts.ts from a readable spec.
# P(en, sw)        -> translation pair (same concept, two languages)
# E(text) / S(text) / M(text) -> single English / Kiswahili / any-language prompt
# kwargs: hint="...", review=True
import json, re, sys
def P(en, sw, **k): return ('mixed', en, k) if en == sw else ('pair', en, sw, k)
def E(t, **k): return ('en', t, k)
def S(t, **k): return ('sw', t, k)
def M(t, **k): return ('mixed', t, k)

R = dict(review=True)

C = {}
# ───────────── GROUP 1: CLASSIC CHARADES (universal, English-led, Swahili pairs) ─────────────
C['animals'] = [P('Lion','Simba'),P('Elephant','Tembo'),P('Giraffe','Twiga'),P('Leopard','Chui'),
  P('Hippo','Kiboko'),P('Crocodile','Mamba'),P('Monkey','Tumbili'),P('Zebra','Pundamilia'),
  P('Snake','Nyoka'),P('Dog','Mbwa'),P('Cat','Paka'),P('Chicken','Kuku'),P('Rhino','Kifaru'),
  P('Frog','Chura'),P('Cow','Ng\'ombe'),P('Fish','Samaki')]
C['movies-tv'] = [M('The Lion King'),M('Black Panther'),M('Titanic'),M('Avatar'),M('Spider-Man'),
  M('Fast & Furious'),M('Money Heist'),M('Game of Thrones'),M('Harry Potter'),M('Squid Game'),
  M('Tom and Jerry'),M('Mr. Bean'),M('Shrek'),M('Frozen'),M('Superman')]
C['music-artists'] = [M('Michael Jackson'),M('Beyoncé'),M('Rihanna'),M('Bob Marley'),M('Drake'),
  M('Chris Brown'),M('Taylor Swift'),M('Ed Sheeran'),M('Shakira'),M('Justin Bieber'),
  P('Guitar','Gitaa'),P('Drums','Ngoma'),P('Piano','Kinanda'),P('Microphone','Kipaza Sauti'),
  M('DJ'),M('Karaoke')]
C['sports'] = [P('Football','Mpira wa Miguu'),P('Basketball','Mpira wa Kikapu'),P('Boxing','Ngumi'),
  P('Swimming','Kuogelea'),P('Running','Kukimbia'),P('Goalkeeper','Kipa'),P('Penalty','Penalti'),
  P('Cycling','Mbio za Baiskeli'),P('Volleyball','Mpira wa Wavu'),M('Tennis'),M('Cristiano Ronaldo'),
  M('Lionel Messi'),M('Usain Bolt'),M('Olympics')]
C['countries-places'] = [P('Egypt','Misri'),P('China','Uchina'),P('India','India'),P('France','Ufaransa'),
  P('Brazil','Brazili'),P('America','Marekani'),P('Japan','Japani'),P('Mount Kilimanjaro','Mlima Kilimanjaro'),
  P('The Pyramids','Mapiramidi'),M('Eiffel Tower'),M('Dubai'),M('London'),M('New York'),P('Desert','Jangwa'),
  P('Beach','Ufukwe')]
C['everyday-things'] = [P('Umbrella','Mwavuli'),P('Flashlight','Tochi'),P('Watch','Saa'),P('Bucket','Ndoo'),
  P('Matches','Kiberiti'),P('Broom','Fagio'),P('Phone Charger','Chaja'),P('Mirror','Kioo'),
  P('Toothbrush','Mswaki'),P('Key','Ufunguo'),P('Chair','Kiti'),P('Iron','Pasi'),P('Glasses','Miwani'),
  P('Phone','Simu')]
C['act-it-out'] = [P('Taking a Selfie','Kupiga Selfie'),P('Sleeping in Class','Kusinzia Darasani'),
  P('Sneezing','Kupiga Chafya'),P('Washing Clothes','Kufua Nguo'),P('Chased by a Dog','Kukimbizwa na Mbwa'),
  P('Brushing Teeth','Kupiga Mswaki'),P('Riding a Bicycle','Kuendesha Baiskeli'),P('Crying','Kulia'),
  P('Laughing','Kucheka'),P('Fishing','Kuvua Samaki'),P('Cooking','Kupika'),P('Dancing','Kucheza Muziki'),
  P('Driving','Kuendesha Gari'),P('Winning the Lottery','Kushinda Bahati Nasibu')]
C['food-drinks'] = [M('Pizza'),P('Ice Cream','Aiskrimu'),M('Burger'),P('Rice','Wali'),P('Bread','Mkate'),
  P('Egg','Yai'),P('Banana','Ndizi'),P('Tea','Chai'),P('Coffee','Kahawa'),P('Orange Juice','Juisi ya Machungwa'),
  P('Watermelon','Tikiti Maji'),P('Chocolate','Chokoleti'),M('Popcorn'),P('Water','Maji'),M('Soda')]

# ───────────── GROUP 2: BONGO & TANZANIAN CULTURE (Kiswahili-led) ─────────────
C['hii-dar-yetu'] = [S('Kariakoo'),M('Coco Beach'),M('Mlimani City'),S('Daraja la Tanzanite'),
  S('Kivuko cha Kigamboni'),S('Daraja la Kigamboni'),S('Mnazi Mmoja'),S('Posta'),M('Samaki Samaki'),
  S('Flyover ya Tazara'),S('Mwendokasi'),S('Foleni'),S('Soko la Samaki Feri')]
C['daladala-diaries'] = [S('Konda'),S('Dereva wa Daladala'),S('Nauli'),S('Chenji'),S('Shusha Hapa!'),
  S('Sogeeni Ndani'),S('Siti ya Mbele'),S('Stendi ya Mwenge'),S('Stendi ya Gerezani'),S('Mwisho wa Gari'),
  S('Kubanana'),S('Mzigo wa Abiria')]
C['bongo-flava'] = [
  M('Diamond Platnumz'),M('Ali Kiba'),M('Harmonize'),M('Zuchu'),M('Marioo'),M('Nandy'),M('Rayvanny'),M('Mbosso'),
  M('WCB Wasafi'),S('Singeli'),S('Kucheza Singeli'),
  M('Tetema',hint='Rayvanny ft. Diamond Platnumz'),M('Kwangwaru',hint='Harmonize ft. Diamond Platnumz'),
  M('Sukari',hint='Zuchu'),M('Salome',hint='Diamond Platnumz ft. Rayvanny'),M('Waah!',hint='Diamond Platnumz'),
  M('Aje',hint='Ali Kiba'),M('Mi Amor',hint='Marioo ft. Jovial'),M('Mama Amina',hint='Marioo'),
  M('Hainaga Ushemeji',hint='Man Fongo'),M('Nyumba Ndogo',hint='Zuchu'),M('Kwetu',hint='Rayvanny')]
C['mtaani'] = [S('Machinga'),S('Mama Ntilie'),S('Duka la Mangi'),S('Genge'),S('Kinyozi'),S('Bodaboda'),
  S('Bajaji'),S('Umeme Umekatika'),
  # merged from the former Vijiweni category
  S('Kijiweni'),S('Kahawa na Kashata'),S('Bao'),S('Kucheza Drafti'),S('Kubishana Mpira'),S('Maskani'),
  S('Kukodi Baiskeli'),S('Kupiga Pamba',**R),S('Utajua Hujui',**R),S('Haina Kufeli',**R)]
C['zilipendwa'] = [
  # 1970s–80s dansi & classics
  M('Shida',hint='Mbaraka Mwinshehe'),M('Pole Dada',hint='Mbaraka Mwinshehe'),
  M('Neema',hint='DDC Mlimani Park Orchestra'),
  # 1990s
  M('Mambo kwa Soksi',hint='Remmy Ongala'),M('Kifo',hint='Remmy Ongala'),M('Kipenda Roho',hint='Remmy Ongala'),
  # 2000s Bongo Flava golden era
  M('Kidali Po',hint='Mr Nice'),M('Siamini',hint='TID'),M('Umenikataa',hint='Ray C'),
  M('Kimya Kimya',hint='Jay Moe ft. Ngwair'),M('Habari Ndiyo Hiyo',hint='Mwana FA ft. AY'),
  M('Mapozi',hint='Mr Blue'),M('Binti Kiziwi',hint='Z Anto'),M('Nakshi Mrembo',hint='Ali Kiba'),
  M('Bembeleza',hint='Marlaw'),M('Siku Hazigandi',hint='Lady Jaydee'),M('Dar Mpaka Moro',hint='TMK Wanaume'),
  M('Nalia kwa Furaha',hint='Bushoke'),M('Anita',hint='Matonya ft. Lady Jaydee'),
  M('Maria Salome',hint='Saida Karoli',**R),
  # ~10 years ago
  M('My Number One',hint='Diamond Platnumz'),M('Mwana',hint='Ali Kiba'),M('Hawajui',hint='Vanessa Mdee'),
  M('Me & You',hint='Ommy Dimpoz ft. Vanessa Mdee')]
C['chakula-chetu'] = [S('Ugali na Samaki'),S('Pilau'),S('Ndizi Nyama'),S('Makande'),S('Supu ya Kongoro'),
  S('Mchemsho'),S('Kitimoto'),S('Mihogo ya Kukaanga'),S('Chapati'),S('Biriani'),S('Chipsi Mayai'),
  S('Wali Maharage'),S('Mishkaki'),S('Maandazi'),S('Chai ya Rangi'),S('Juisi ya Miwa'),S('Vitumbua'),S('Urojo')]
C['watu-maarufu'] = [S('Mwalimu Nyerere'),M('Samia Suluhu Hassan'),M('Haji Manara'),M('Millard Ayo'),
  M('Idris Sultan'),M('Jokate Mwegelo'),M('Ahmed Ally'),M('Masoud Kipanya'),M('Professor Jay'),
  M('Lady Jaydee'),M('Mandonga Mtu Kazi'),M('Mbwana Samatta')]
C['movie-za-bongo'] = [M('Steven Kanumba'),M('Ray Kigosi'),M('Wema Sepetu'),M('JB'),M('Irene Uwoya'),
  M('Monalisa'),M('Aunt Ezekiel'),M('Single Mtambalike'),M('Huba',**R),M('Jua Kali',**R),M('Ze Comedy',**R),
  S('Filamu ya Kibongo'),S('Kuigiza Kulia')]
C['mpira-mashabiki'] = [M('Simba SC'),M('Yanga SC'),S('Kariakoo Derby'),S('Uwanja wa Mkapa'),M('Azam FC'),
  M('Taifa Stars'),S('Jangwani'),S('Vuvuzela'),S('Kadi Nyekundu'),S('Kipa Amedaka'),S('Goli Dakika ya 90'),
  S('Ndondo Cup'),S('Shabiki Analia'),S('Kubeti')]
C['chuo-life'] = [S('Boom'),S('Hosteli'),S('Mtihani wa UE'),S('Kupiga Msuli'),S('Lecture'),S('Kanteeni'),
  S('Mahafali'),S('Carry Over'),S('Sapu',**R),S('Notes za Mtihani'),S('Mhadhiri Mkali'),S('Kugombea Siti'),
  S('Group Discussion')]
C['mapenzi-mahusiano'] = [S('Mahari'),M('Send-off'),S('Harusi'),S('Posa'),S('Shemeji'),S('Kuchunwa Buzi'),
  S('Kuvunja Uchumba'),S('Kutongoza'),S('Wivu'),S('Kuomba Namba'),S('Siku ya Wapendanao'),S('Baby')]
C['shughuli-za-familia'] = [M('Kitchen Party'),S('Kikao cha Harusi'),S('Mkesha wa Mwaka Mpya'),
  S('Kipaimara'),S('Kadi ya Mchango'),S('Bibi Harusi'),S('MC wa Sherehe'),S('Sherehe ya Kuzaliwa'),
  S('Shikamoo'),S('Shangazi'),S('Mjomba'),S('Bibi na Babu'),S('Masufuria ya Sherehe')]

# ───────────── GROUP 3: EAST AFRICA & BEYOND (Africa-wide, English-led) ─────────────
C['east-african-vibes'] = [M('Matatu'),M('Rolex',hint='Ugandan street snack'),M('Kitenge'),
  P('Lake Victoria','Ziwa Victoria'),P('Gorilla Trekking','Kutembelea Sokwe'),M('Safari'),
  M('Great Migration'),P('Maasai Jumping Dance','Ngoma ya Kimaasai'),P('Kanga','Kanga'),
  P('Nyama Choma','Nyama Choma'),M('Mombasa'),M('Zanzibar'),M('Source of the Nile')]
C['african-icons'] = [M('Nelson Mandela'),M('Kwame Nkrumah'),M('Wangari Maathai'),M('Kofi Annan'),
  M('Miriam Makeba'),M('Chinua Achebe'),M('Thomas Sankara'),M('Haile Selassie'),M('Fela Kuti'),
  M('Patrice Lumumba'),M('Mohamed Salah'),M('Didier Drogba'),M("Lupita Nyong'o"),M('Trevor Noah')]
C['african-music'] = [M('Afrobeats'),M('Amapiano'),M('Rhumba'),M('Highlife'),M('Gengetone'),M('Kwaito'),
  M('Burna Boy'),M('Wizkid'),M('Davido'),M('Tems'),M('Tyla'),M('Sauti Sol'),M('Fally Ipupa'),
  M('Koffi Olomide'),M('Yemi Alade'),M('Angélique Kidjo'),M('Jerusalema',hint='Master KG'),
  M('Sitya Loss',hint='Eddy Kenzo')]
C['african-cities'] = [M('Dar es Salaam'),M('Nairobi'),M('Kampala'),M('Kigali'),M('Johannesburg'),
  M('Cape Town'),M('Lagos'),M('Cairo'),M('Accra'),M('Addis Ababa'),M('Kinshasa'),M('Marrakech'),M('Dakar')]
C['pop-culture'] = [M('TikTok Dance Challenge'),E('Viral Meme'),E('Red Carpet'),M('Trending on X'),
  M('YouTuber'),M('Podcast'),E('Celebrity Breakup'),M('Paparazzi'),E('Live Stream'),
  M('Jerusalema Dance Challenge'),M('Wakanda Forever Salute'),M('Big Brother Naija'),M('Influencer'),
  E('Binge-watching')]
C['throwback-hits'] = [M('Malaika',hint='Fadhili William'),M('Jambo Bwana',hint='Them Mushrooms'),
  M('Pata Pata',hint='Miriam Makeba'),M('Sweet Mother',hint='Prince Nico Mbarga'),
  M('Yéké Yéké',hint="Mory Kanté"),M('Wale Watu',hint='Khadja Nin'),M('Shauri Yako',hint='Super Mazembe'),
  M('African Queen',hint='2Face Idibia'),M('Waka Waka',hint='Shakira'),M('Thriller',hint='Michael Jackson'),
  M('Billie Jean',hint='Michael Jackson'),M('Macarena'),M('Gangnam Style',hint='PSY'),
  M('One Love',hint='Bob Marley')]

ABBR = {'animals':'anim','movies-tv':'mov','music-artists':'mus','sports':'spt','countries-places':'plc',
 'everyday-things':'evd','act-it-out':'act','food-drinks':'food','hii-dar-yetu':'dar','daladala-diaries':'dld',
 'bongo-flava':'bf','mtaani':'mta','zilipendwa':'zil','chakula-chetu':'chk','watu-maarufu':'wtm',
 'movie-za-bongo':'mzb','mpira-mashabiki':'mpr','chuo-life':'chuo','mapenzi-mahusiano':'mpz',
 'shughuli-za-familia':'fam','east-african-vibes':'eav','african-icons':'aic','african-music':'amu',
 'african-cities':'acy','pop-culture':'pop','throwback-hits':'tbk'}

def slug(t): return re.sub(r'[^a-z0-9]+','-',t.lower()).strip('-')
def lit(v): return json.dumps(v, ensure_ascii=False).replace('"',"'") if "'" not in v else json.dumps(v, ensure_ascii=False)

rows=[]
for cat, items in C.items():
  a=ABBR[cat]; n=0
  for it in items:
    if it[0]=='pair':
      _,en,sw,k=it; concept=f'{a}-{slug(en)}'
      for lang,t in (('en',en),('sw',sw)):
        n+=1; rows.append(dict(id=f'{a}-{n}',text=t,categoryId=cat,language=lang,concept=concept,**k))
    else:
      lang,t,k=it; n+=1; rows.append(dict(id=f'{a}-{n}',text=t,categoryId=cat,language=lang,**k))

def ts(r):
  parts=[f"id: {lit(r['id'])}",f"text: {lit(r['text'])}",f"categoryId: {lit(r['categoryId'])}",f"language: {lit(r['language'])}"]
  if 'concept' in r: parts.append(f"concept: {lit(r['concept'])}")
  if 'hint' in r: parts.append(f"hint: {lit(r['hint'])}")
  if r.get('review'): parts.append("needsReview: true")
  return '  { '+', '.join(parts)+' },'

out=[]
cur=None
for r in rows:
  if r['categoryId']!=cur:
    cur=r['categoryId']; out.append(f'\n  // ── {cur} ──')
  out.append(ts(r))
body='\n'.join(out)

import os
target=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','src','data','prompts.ts')
src=open(target,encoding='utf-8').read()
marker='export const PROMPTS: GamePrompt[] = ['
start=src.index(marker)+len(marker)
end=src.index('\n]\n\n/** Language preference')
open(target,'w',encoding='utf-8').write(src[:start]+body+src[end:])
print(f'Wrote {len(rows)} prompts across {len(C)} categories to src/data/prompts.ts')
