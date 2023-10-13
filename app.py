from flask import Flask, render_template, request

import helper.helper as hp
#import helper.models as hm

DAYS_TO_CONSIDER = 60

app = Flask(__name__)

#model = hm.create_model(DAYS_TO_CONSIDER);
#scaler = hm.train(model)

@app.route("/")
def index():
    return render_template('dashboard.html')

@app.route('/dashboard/')
def dashboard():
    return render_template('dashboard.html')

@app.route('/ticker/', methods=('POST',))
def ticker():
    if request.method == "POST":
        response = hp.get_data_recent(request.form['ticker'], years_ago = 1)
        return response

"""
@app.route('/bake/', methods=('POST',))
def bake():
    if request.method == "POST":
        response = hm.predict_close(model, request.form['tickers'], scaler)
        return response
"""
