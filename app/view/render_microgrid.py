import streamlit as st
import requests
from collections import deque
import pandas as pd
from view.component.chart import AltChart
from view.htmlFunctions.center import centerText


def render_microgrid():

    centerText("Le BESS est en isochrone, il assume les variations de charge, l'EMS adapte le setpoint du genset en P/Q")
    st.markdown("""
    <style>
    .row-widget.stColumns [class*="column"] {
        display: flex;
        flex-direction: column;
    }
    .row-widget.stColumns [class*="column"] > div:first-child {
        flex: 1;
    }
    </style>
    """, unsafe_allow_html=True)


    

    card_style = """
        <div style="
            background-color: #f9f9f9;
            padding: 20px;
            margin-top: 30px;
            border-radius: 15px;
            box-shadow: 0px 4px 6px rgba(0,0,0,0.1);
            text-align: center;
             min-height: 180px;
        ">
            <h3 style="color:#333;">{title}</h3>
            <p style="font-size:24px; font-weight:bold; color:#007bff;">{value}</p>
            <p style="color:gray;">{subtitle}</p>
        </div>
    """

    # récupérer les données
    try:
        resp = requests.get("http://127.0.0.1:8000/status")
        resp.raise_for_status()
        data = resp.json()
    except:
        st.write("HTTP error: cannot fetch status")
        return

    # bouton restart
    _, col, _ = st.columns([3,2,3])
    with col:
        if st.button("restart ems", use_container_width=True):
            try:
                resp = requests.post("http://127.0.0.1:8000/restart")
                resp.raise_for_status()
            except:
                st.error("HTTP error: cannot restart EMS")

    
    card_style2 = """
        <div style="
            background-color:#f9f9f9;
            padding:20px;
            border-radius:15px;
            box-shadow:0px 4px 6px rgba(0,0,0,0.1);
            margin-top:20px;
            font-family:Arial, sans-serif;
            line-height:1.6;
            text-align:center;
        ">
            <h3 style="margin-bottom:10px;">{title}</h3>
            <p style="margin:5px 0;">{line1}</p>
            <p style="margin:5px 0;">{line2}</p>
        </div>
        """

    col1, col2, col3 = st.columns(3)

    with col1:
        st.markdown(
            card_style2.format(
                title="🔋 BESS",
                line1=f"Pmax = <b>{data['P_max_bess']} kW</b>",
                line2=f"Capacité = <b>{data['Cap_bess']} kWh</b>"
            ),
            unsafe_allow_html=True
        )

    with col2:
        st.markdown(
            card_style2.format(
                title="⚡ Genset",
                line1=f"Pmax = <b>{data['P_max_genset']} kW</b>",
                line2="&nbsp;"
            ),
            unsafe_allow_html=True
        )

    with col3:
        st.markdown(
            card_style2.format(
                title="🌞 PV",
                line1="Pmax = <b>illimitée 🙂</b>",
                line2="&nbsp;"
            ),
            unsafe_allow_html=True
        )

    st.markdown("<br>", unsafe_allow_html=True)  # espace
        
    
    col1, col2= st.columns(2)
    with col2:
        centerText("<br>")
        with st.form(key="pv_form"):
            pv_value = st.number_input(
                "Entrer la puissance PV (kW)",
                min_value=0.0,
                value=200.0,
                step=50.0
            )
            load_value = st.number_input(
                "Entrer la load (kW)",
                min_value=0.0,
                max_value=4000.0,
                value=1500.0,
                step=50.0
            )
            submit = st.form_submit_button("Valider")  

        if submit:
            try:
                resp = requests.post(
                    "http://127.0.0.1:8000/setpvp",
                    json={"P_pv": pv_value,
                          "P_load": load_value}
                )
                resp.raise_for_status()
            except Exception as e:
                st.error(f"Erreur HTTP: {e}")
    
    with col1:
        centerText("Modifie la configuration du BESS et du genset")
        with st.form(key="conf_form"):
            bess_p_max_value = st.number_input(
                "Puissance max bess (kW)",
                min_value=100,
                value=1200,
                step=50
            )
            bess_cap_value = st.number_input(
                "capacité Bess kWh",
                min_value=0,
                value=20,
                step=20
            )
            genset_p_max_value = st.number_input(
                "Puissance max genset (kW)",
                min_value=100,
                value=1000,
                step=20
            )
            submit = st.form_submit_button("Valider")  

        if submit:
            try:
                resp = requests.post(
                    "http://127.0.0.1:8000/setconf",
                    json={"p_max_bess": bess_p_max_value,
                          "cap_bess": bess_cap_value,
                          "p_max_genset": genset_p_max_value}
                )
                resp.raise_for_status()
            except Exception as e:
                st.error(f"Erreur HTTP: {e}")

    st.markdown("<br>", unsafe_allow_html=True)  # espace

    # Load
    _, col, _ = st.columns(3)
    with col:
        st.markdown(card_style.format(title="Load", value=f"{data['load']} kW", subtitle=""), unsafe_allow_html=True)

    # BESS / Genset / PV
    col1, col2, col3 = st.columns(3)
    with col1:
        st.markdown(
            card_style.format(
                title="BESS",
                value=f"SOC = {data['SOC']} % <br> {data['P_bess']:.1f} kW",
                subtitle="Battery infos"
            ),
            unsafe_allow_html=True
        )
    with col2:
        st.markdown(
            card_style.format(
                title="Genset",
                value=f"{data['P_genset']} kW <br> &nbsp;",
                subtitle="Genset infos"
            ),
            unsafe_allow_html=True
        )
    with col3:
        st.markdown(
            card_style.format(
                title="PV",
                value=f"{data['P_pv']} kW <br> &nbsp;",
                subtitle="PV infos"
            ),
            unsafe_allow_html=True
        )


    status_style = """
        <div style="
            background-color: {bgcolor};
            padding: 20px;
            margin-top: 30px;
            border-radius: 15px;
            box-shadow: 0px 4px 6px rgba(0,0,0,0.1);
            text-align: center;
            color: white;
            font-size: 20px;
            font-weight: bold;
        ">
            {message}
        </div>
    """

    if not data["blackout"]:
        st.markdown(status_style.format(bgcolor="#28a745", message="✅ Réseau stable"), unsafe_allow_html=True)
    else:
        st.markdown(status_style.format(bgcolor="#dc3545", message="⚠️ Blackout"), unsafe_allow_html=True)

    if "p_bess" not in st.session_state:
        st.session_state.p_bess = deque(maxlen=10)
    if "p_genset" not in st.session_state:
        st.session_state.p_genset = deque(maxlen=10)
    if "p_pv" not in st.session_state:
        st.session_state.p_pv = deque(maxlen=10)
    if "p_load" not in st.session_state:    
        st.session_state.p_load = deque(maxlen=10)

    st.session_state.p_bess.append(data["P_bess"])
    st.session_state.p_genset.append(data["P_genset"])
    st.session_state.p_pv.append(data["P_pv"])
    st.session_state.p_load.append(data["load"])

    df_bess = pd.DataFrame({"x": range(len(st.session_state.p_bess)), "y": st.session_state.p_bess})
    df_genset = pd.DataFrame({"x": range(len(st.session_state.p_genset)), "y": st.session_state.p_genset})
    df_pv = pd.DataFrame({"x": range(len(st.session_state.p_pv)), "y": st.session_state.p_pv})
    df_load = pd.DataFrame({"x": range(len(st.session_state.p_load)), "y": st.session_state.p_load})

    col1, col2 = st.columns(2)
    with col1:
        centerText("Puissance BESS kW")
        AltChart(df_bess, xlabel="X", ylabel="P Bess kW ")
        centerText("Puissance Genset kW")
        AltChart(df_genset, xlabel="X", ylabel="P genset kW ")
    
    with col2:
        centerText("Puissance PV kW")
        AltChart(df_pv, xlabel="X", ylabel="P PV kW ")
        centerText("Load kW")
        AltChart(df_load, xlabel="X", ylabel="Load kW ")
