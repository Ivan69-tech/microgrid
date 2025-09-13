import threading
from genset import Genset 
from load import Load 
from PV import PV 
from bess import BESS 
import time 


class ems:
    def __init__(self, conf):
        self.conf = conf
        self.dt = conf["dt"]

        self.genset = Genset(conf["genset"]["max_p_kW"])
        self.bess = BESS(
            conf["bess"]["cap_kwh"],
            conf["bess"]["max_p_kw"],
            conf["bess"]["f_nom"],
            conf["bess"]["u_nom"],
            self.dt
        )
        self.PV = PV(conf["pv"]["p_kW"])
        self.load = Load(conf["load"]["load"])

        self.count = 0
        self.running = False
        self.thread = None

        self.blackout = False

    def cycle(self):
        self.running = True
        while self.running:

            P_bess = self.bess.set_P(self.load.load - self.PV.P_kw)
            self.genset.set_P(self.load.load - P_bess - self.PV.P_kw)
            self.count += 1

            self.blackout_conditions()
            
            if self.blackout:
                self.bess.set_P(0)
                self.genset.set_P(0)
                self.PV.set_p_kw(0)
                self.load.set_p_load_kw(0)
            
            time.sleep(self.dt)

            

    def start(self):
        """Lancer EMS si pas déjà en cours"""
        if not self.running:
            self.thread = threading.Thread(target=self.cycle, daemon=True)
            self.thread.start()

    def stop(self):
        """Arrêter le thread EMS proprement"""
        self.running = False
        if self.thread is not None:
            self.thread.join(timeout=2)

    def restart(self):
        """Redémarrer l'EMS depuis zéro"""
        self.stop()  # stop le thread actuel
        self.count = 0  # reset compteur
        self.bess.soc = 50  # ou valeur initiale de SOC
        self.blackout = False
        self.load.load = 1000
        self.start()  # relance le thread

    def blackout_conditions(self):
        self.blackout = self.genset.P < 0 \
        or self.genset.P > self.genset.max_P \
        or self.load.load == 0 \
        or abs(self.PV.P_kw + self.bess.P_kw + self.genset.P - self.load.load) > 1 
        
    
    def set_pv_p_kw(self, P):
        self.PV.set_p_kw(P)


    def set_load_p_kw(self, P):
        self.load.set_p_load_kw(P)


    def set_conf(self, p_max_bess, cap_bess, p_max_genset):
        self.bess.max_p_kw = p_max_bess
        self.bess.cap_kwh = cap_bess
        self.genset.max_P = p_max_genset
