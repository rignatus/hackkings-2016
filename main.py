import numpy as np 
import pandas as pd 

import os

path_to_file = os.getcwd()+"/data.json"
data = pd.read_json(path_to_file, numpy=False)
data = data.drop(data.columns[['createdAt', 'updatedAt', 'geohash', 'credibility', 'attributions', 'sources', 'removal_reason']], axis=1)
print data