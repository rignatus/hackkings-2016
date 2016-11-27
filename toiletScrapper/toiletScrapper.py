import json

def getKey(item):
    return item['credibility']


def getCoordName(parsed_json):
    currentData = {}
    toiletData = []
    for feature in parsed_json['features']:
        try:
            coord = feature['geometry']['coordinates']
            name = feature['properties']['name']
        except KeyError:
            coord = ''
        toiletData.append({
            'coordinates': coord,
            'name': name
            })
    
    return toiletData


def getCredibil(parsed_json):
    currentData = {}
    toiletData = []
    for feature in parsed_json['features']:
        try:
            name = feature['properties']['name']
            cred = feature['credibility']
        except KeyError:
            pass
        toiletData.append({
            'name': name,
            'credibility': cred
            })
    return sorted(toiletData, key=getKey, reverse=True)


def main():
    f = open('data.json', 'r')
    data = f.read()
    data = ''.join(data)
    data = data.replace('\n', '')
    parsed_json = json.loads(data)
    #json_data = json.dumps(getCoordName(parsed_json))
    dataList = getCredibil(parsed_json)
    json_data = json.dumps(dataList)
    print json_data


if __name__ == '__main__':
    main()
