import streamlit as st
from streamlit_autorefresh import st_autorefresh
import requests
from view.render_microgrid import render_microgrid
from view.htmlFunctions.generalStyle import generalStyle
from view.render_title import render_title

st_autorefresh(interval=1000, limit=None, key="count")




generalStyle()

render_title()

render_microgrid()

    