class BESS:
    def __init__(self, cap_kwh, max_p_kw, f_nom, u_nom, dt):
        self.cap_kwh = cap_kwh
        self.max_p_kw = max_p_kw
        self.f_nom = f_nom
        self.u_nom = u_nom
        self.soc = 50
        self.max_charge = -max_p_kw
        self.max_discharge = max_p_kw

        self.P_kw = 0
        self.dt = dt

    def set_P(self, P):
        
        if self.soc == 0 and P > 0:
            self.P_kw = 0
        elif self.soc == 100 and P < 0:
            self.P_kw = 0
        elif P > self.max_p_kw:
            self.P_kw = self.max_p_kw
        elif P < -self.max_p_kw:
            self.P_kw = -self.max_p_kw
        else:
            self.P_kw = P

        self.compute_soc()
        self.update_Pmax()

        return self.P_kw
    
    def compute_soc(self) :
        self.soc = self.soc - (((self.P_kw * self.dt) / 3600) / self.cap_kwh) * 100
        if self.soc < 0 :
            self.soc = 0
        elif self.soc > 100 :
            self.soc = 100
    
    def update_Pmax(self):
        if self.soc == 100 :
            self.max_charge = 0
        elif self.soc == 0 :
            self.max_discharge = 0
        else:
            self.max_charge = -self.max_p_kw
            self.max_discharge = self.max_p_kw


    
    
    

    