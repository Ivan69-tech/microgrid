from fastapi import FastAPI
import uvicorn
from ems import ems
import yaml
from pydantic import BaseModel

class PInput(BaseModel):
    P_pv: float
    P_load: float

class ConfInput(BaseModel):
    p_max_bess: float
    cap_bess: float
    p_max_genset: float

class ControlPV(BaseModel):
    controlPv: bool


app = FastAPI()

# Charger ton EMS
with open("conf.yaml", "r") as f:
    conf = yaml.safe_load(f)

ems_system = ems(conf)
ems_system.start() 


@app.get("/status")
def get_status():
    return {
        "P_bess": ems_system.bess.P_kw,  
        "SOC": round(ems_system.bess.soc,1),
        "P_genset": ems_system.genset.P,
        "P_pv": ems_system.PV.P_kw,
        "load": ems_system.load.load,
        "count": ems_system.count,
        "blackout": ems_system.blackout,
        "P_max_bess":ems_system.bess.max_p_kw,
        "Cap_bess":ems_system.bess.cap_kwh,
        "P_max_genset": ems_system.genset.max_P,
        "controlPv": ems_system.controlPv,
    }


@app.post("/restart")
def stop_ems():
    ems_system.restart()
    return {"status": "EMS restart"}



@app.post("/setpvp")
def set_p_kw(input: PInput):
    ems_system.set_pv_p_kw(input.P_pv)
    ems_system.set_load_p_kw(input.P_load)
    return {"status": "PV updated", "P": input.P_pv}


@app.post("/setconf")
def set_p_kw(input: ConfInput):
    ems_system.set_conf(input.p_max_bess, input.cap_bess, input.p_max_genset)
    ems_system.restart()
    return {"status": "conf updated"}


@app.post("/controlpv")
def controlPV(input: ControlPV):
    ems_system.control_pv(input.controlPv)
    return {"status": "PV control updated"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
