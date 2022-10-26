from bs4 import BeautifulSoup
import requests
import time
from fake_useragent import UserAgent
import pandas as pd
import concurrent.futures
import pandas as pd
from flask import Flask, jsonify

app = Flask(__name__)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods',
                         'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/', methods=['GET'])
def beinmatch():
    agent = UserAgent(verify_ssl=False)

    beinmatch = update(agent)

    return jsonify(beinmatch)


@app.route('/check', methods=['GET'])
def check():
    return jsonify({'status': 'ok'})


def update(agent):
    dataframe = pd.DataFrame(columns=['team1', 'team2', 'score_team1', 'score_team2',
                                      'match_type', 'state', 'image_team1', 'image_team2', 'match_link'])

    def get_data(item):
        live_url = "https://beinmatch.ma/home/live/"

        data = [team.text.strip()
                for team in item.find_all('td', {'class': 'tdTeam'})]
        data.extend([int(score.text.strip()) if score.text.strip(
        ) != "" else -1 for score in item.find_all('td', {'class': 'tdScore'})])
        data.extend([s.text.strip().replace('GMT', '') for s in item.find('td', {'class': 'compStl'}).find_all('td')] if [s.text.strip().replace(
            'GMT', '') for s in item.find('td', {'class': 'compStl'}).find_all('td')] != [] else ["أمس"]+[s.text.strip() for s in item.find('td', {'class': 'compStl'})])
        data.extend([s.div['style'].split('(')[1].split(')')[0].split(' ')[0]
                    for s in item.find_all('td', {'class': 'tdFlag'})])
        data.append(BeautifulSoup(requests.get(live_url+item.find('button', {'class': 'btn'})['onclick'].split('(')[1].split(')')[0].split(',')[0]+"/1/"+item.find('button', {'class': 'btn'})['onclick'].split('(')[1].split(')')[0].split(',')[1].replace("'", ""), headers={'User-Agent': UserAgent().random}).content, 'lxml').find('iframe')[
                    'src'] if BeautifulSoup(requests.get(
                        live_url
                        + item.find('button', {'class': 'btn'})['onclick'].split(
                            '(')[1].split(')')[0].split(',')[0]
                        + "/1/"+item.find('button', {'class': 'btn'})['onclick'].split('(')[1].split(')')[0].split(',')[1].replace("'", ""), headers={'User-Agent': UserAgent().random}
                    ).content, 'lxml').find('iframe') != None else live_url
                    + item.find('button', {'class': 'btn'})['onclick'].split(
                        '(')[1].split(')')[0].split(',')[0]
                    + "/1/"+item.find('button', {'class': 'btn'})['onclick'].split('(')[1].split(')')[0].split(',')[1].replace("'", ""))
        dataframe.loc[len(dataframe)] = data

    print('[INFO] Starting Beinscrap 🔥')
    print('[INFO] Getting into website 💀')
    soup = BeautifulSoup(requests.get('https://beinmatchtv.tv/',
                                      headers={'User-Agent': agent.random}).content, 'lxml')
    print('[SUCCESS] Website is opened 🎉')
    print('[INFO] Getting items 🧑‍💻')
    items = soup.find_all('table', {"class": "tabIndex"})[:-1]
    print('[SUCCESS] Items are gotten 🎉')
    print('[INFO] Getting data from website with Multi-Threading 🤖')
    start_time = time.time()
    with concurrent.futures.ThreadPoolExecutor(max_workers=max(61, len(items))) as executor:
        executor.map(get_data, items)

    print('[SUCESS] Data is gotten 🎉')

    beinmatch = dataframe.T.to_dict()

    end_time = time.strftime("%H:%M:%S", time.gmtime(time.time() - start_time))
    print('[UwU] Done in {}'.format(end_time))

    return beinmatch
