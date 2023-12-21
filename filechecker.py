import os

base_url = "./static/resources/posters/"
filenames = []

for folder in os.listdir(base_url):
    if folder != '.DS_Store':
        for subfolder in os.listdir(base_url+folder):
            if subfolder != '.DS_Store':
                for subsubfolder in os.listdir(base_url+folder+'/'+subfolder):
                    if subsubfolder != '.DS_Store':
                        for subsubsubfolder in os.listdir(base_url+folder+'/'+subfolder+'/'+subsubfolder):
                            if subsubsubfolder != '.DS_Store':
                                filename = subsubsubfolder
                                if filename not in filenames:
                                    print(base_url+folder+'/'+subfolder+'/'+subsubfolder+'/'+filename)
                                    filenames.append(filename)
                                    