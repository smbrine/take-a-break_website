from flask import Flask, render_template, jsonify, url_for, request, send_from_directory, Blueprint, send_file
import json
from base64 import urlsafe_b64encode, urlsafe_b64decode
import random
import os
import time

def base64UrlDecode(base64Url):
    padding = b'=' * (4 - (len(base64Url) % 4))
    decoded_bytes = urlsafe_b64decode(base64Url.encode() + padding)
    return decoded_bytes.decode()  # Convert bytes to string

with open('./static/resources/outcomes.json', 'r', encoding='utf-8') as f:
    outcomes = json.load(f)

with open('./static/resources/cases.json', 'r', encoding='utf-8') as f:
        cases = json.load(f)

def refresh_cases():
    with open('./static/resources/cases.json', 'r', encoding='utf-8') as f:
        cases = json.load(f)
    return cases

app = Flask(__name__)

@app.route('/')
def homepage():
    return render_template('index.html')

@app.route('/kiosk')
def homepage_kiosk():
    return render_template('index_kiosk.html')

@app.route('/constructor')
def constructor():
    return render_template('constructor.html')

@app.route('/poster/<string:url>')
def poster_share(url):
    return render_template('poster.html',
                           img_path = base64UrlDecode(url),
                           img_path_pre=base64UrlDecode(url).replace('./', 'static/'))

@app.route('/logo-qr')
def akar_qr():
    url = request.args.get('brand')
    return None

@app.route('/main-kiosk')
def main_mirror():
    return render_template('home_view.html')

@app.route('/poster-kiosk/<string:url>')
def poster_share_kiosk(url):
    return render_template('poster_kiosk.html',
                           img_path = base64UrlDecode(url),
                           img_path_pre=base64UrlDecode(url).replace('./', 'static/'))

@app.route('/puzzle')
def puzzle():
    images = [
        "resources/puzzle-img/img1.png",
        "resources/puzzle-img/img2.jpeg",
        "resources/puzzle-img/img3.png",
        "resources/puzzle-img/img4.jpg"
    ]
    
    image_path = url_for('static', filename=images[random.randint(0,3)])
    
    return render_template('puzzle.html',
                           image_path = image_path)

@app.route('/open-case/<string:poster_name>')
def open_poster(poster_name):
    cases = refresh_cases()
    if poster_name in cases:
        data = cases[poster_name]
        b_size = data['b_size']
        p_name_h = data['poster_name_header']
        coords_info = data['button-info']['coords']
        coords_b1 = data['button-1']['coords']
        coords_b2 = data['button-2']['coords']
        coords_b3 = data['button-3']['coords']
        coords_b4 = data['button-4']['coords']
        coords_b5 = data['button-5']['coords']
        
        return render_template('case.html', 
                               case_path=url_for('static', filename=data['case-image-src']), 
                               data=data, 
                               poster_name=poster_name,
                               poster_name_header=p_name_h,
                               coords_info=coords_info,
                               b_size = b_size,
                               coords_b1=coords_b1,
                               coords_b2=coords_b2,
                               coords_b3=coords_b3,
                               coords_b4=coords_b4,
                               coords_b5=coords_b5
                               )

@app.route('/button-data')
def button_data():
    cases = refresh_cases()
    poster = request.args.get('poster')
    b_number = request.args.get('b_num')
    return jsonify(cases[poster][f'button-{b_number}']['data'])

@app.route('/resources/<string:filename>', methods=['GET'])
def return_json(filename):
    if filename == "outcomes":
        return jsonify(outcomes)
    elif filename == 'cases':
        cases = refresh_cases()
        return jsonify(cases)

@app.route('/revive-image/<path:image_path>', methods=['GET'])
def revive_image(image_path):
    return url_for('static', filename=f'resources/cases/{image_path}')

@app.route('/get-img/<path:image_path>')
def get_img(image_path):
    return send_file(image_path)

@app.route('/get-icon/<string:filename>')
def icons(filename):
    return send_from_directory(
        os.path.join(app.root_path,'static','resources','icons','favicon_package'),
        filename,mimetype='image/vnd.microsoft.icon')

@app.route('/appstore')
def appstore():
    return """
            <script>
            window.location.replace('itms-apps://apps.apple.com/ru/app/exponent-visitor/id6449500506?l=en-GB')
            </script>
            """

# if __name__ == '__main__':
#     from waitress import serve
#     serve(app, host='127.0.0.1', port=8000, _quiet=False)

if __name__ == '__main__':
    app.run(port=8000, host='127.0.0.1', debug=True)
    
# if __name__ == '__main__':
#     app.run(ssl_context=('./ssl/certificate.crt', './ssl/www.interact.reklama145.ru.key'), port=443, host='0.0.0.0', debug=True)