import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import numpy as np

def create_power_flow_chart(data):
    """
    Crée un graphique de flux de puissance animé entre les composants du micro-réseau
    """
    
    # Extraction des données
    p_bess = data.get('P_bess', 0)
    p_genset = data.get('P_genset', 0)
    p_pv = data.get('P_pv', 0)
    p_load = data.get('load', 0)
    soc = data.get('SOC', 0)
    
    # Définition des positions des composants (coordonnées x, y)
    positions = {
        'PV': (0, 1),
        'BESS': (0, 0),
        'Genset': (1, 0),
        'Load': (0.5, -1)
    }
    
    # Couleurs des composants (plus contrastées)
    colors = {
        'PV': '#FF6B35',      # Orange vif pour le PV
        'BESS': '#1E3A8A',    # Bleu foncé pour la batterie
        'Genset': '#059669',   # Vert foncé pour le générateur
        'Load': '#DC2626'     # Rouge foncé pour la charge
    }
    
    # Création de la figure
    fig = go.Figure()
    
    # Ajout des bulles des composants
    for component, (x, y) in positions.items():
        # Taille de la bulle basée sur la puissance (plus grande)
        power = data.get(f'P_{component.lower()}', 0) if component != 'Load' else data.get('load', 0)
        size = max(60, min(120, abs(power) / 10 + 60))  # Taille entre 60 et 120
        
        # Couleur de la bulle
        color = colors[component]
        
        # Texte à afficher
        if component == 'BESS':
            text = f"{component}<br>{power:.1f} kW<br>SOC: {soc:.1f}%"
        else:
            text = f"{component}<br>{power:.1f} kW"
        
        fig.add_trace(go.Scatter(
            x=[x],
            y=[y],
            mode='markers+text',
            marker=dict(
                size=size,
                color=color,
                opacity=0.9,
                line=dict(width=4, color='white')
            ),
            text=text,
            textposition="middle center",
            textfont=dict(size=14, color='white', family="Arial Black"),
            name=component,
            hovertemplate=f"<b>{component}</b><br>Puissance: {power:.1f} kW<br><extra></extra>",
            showlegend=False
        ))
    
    # Ajout des flèches de flux de puissance (simplifié pour éviter le clignotement)
    
    # Flux PV vers BESS (si PV > 0 et BESS se charge)
    if p_pv > 0 and p_bess < 0:  # BESS se charge (puissance négative)
        flow_power = min(p_pv, abs(p_bess))
        fig.add_annotation(
            x=0.15, y=0.5,
            ax=0.15, ay=0.3,
            arrowhead=2,
            arrowsize=1.5,
            arrowwidth=4,
            arrowcolor='#FF6B35',
            showarrow=True
        )
        fig.add_annotation(
            x=0.15, y=0.4,
            text=f"{flow_power:.0f} kW",
            showarrow=False,
            font=dict(size=12, color='#FF6B35', family="Arial Black"),
            bgcolor='rgba(255,255,255,0.8)',
            bordercolor='#FF6B35',
            borderwidth=1
        )
    
    # Flux PV vers Load (si PV > 0)
    if p_pv > 0:
        pv_to_load = min(p_pv, p_load)
        if pv_to_load > 0:
            fig.add_annotation(
                x=0.25, y=0.2,
                ax=0.25, ay=-0.3,
                arrowhead=2,
                arrowsize=1.5,
                arrowwidth=4,
                arrowcolor='#FF6B35',
                showarrow=True
            )
            fig.add_annotation(
                x=0.25, y=0.1,
                text=f"{pv_to_load:.0f} kW",
                showarrow=False,
                font=dict(size=12, color='#FF6B35', family="Arial Black"),
                bgcolor='rgba(255,255,255,0.8)',
                bordercolor='#FF6B35',
                borderwidth=1
            )
    
    # Flux BESS vers Load (si BESS se décharge)
    if p_bess > 0:  # BESS se décharge
        bess_to_load = min(p_bess, p_load)
        if bess_to_load > 0:
            fig.add_annotation(
                x=0.15, y=-0.2,
                ax=0.35, ay=-0.3,
                arrowhead=2,
                arrowsize=1.5,
                arrowwidth=4,
                arrowcolor='#1E3A8A',
                showarrow=True
            )
            fig.add_annotation(
                x=0.25, y=-0.3,
                text=f"{bess_to_load:.0f} kW",
                showarrow=False,
                font=dict(size=12, color='#1E3A8A', family="Arial Black"),
                bgcolor='rgba(255,255,255,0.8)',
                bordercolor='#1E3A8A',
                borderwidth=1
            )
    
    # Flux Genset vers Load (si Genset > 0)
    if p_genset > 0:
        genset_to_load = min(p_genset, p_load)
        if genset_to_load > 0:
            fig.add_annotation(
                x=0.85, y=-0.2,
                ax=0.35, ay=-0.3,
                arrowhead=2,
                arrowsize=1.5,
                arrowwidth=4,
                arrowcolor='#059669',
                showarrow=True
            )
            fig.add_annotation(
                x=0.75, y=-0.3,
                text=f"{genset_to_load:.0f} kW",
                showarrow=False,
                font=dict(size=12, color='#059669', family="Arial Black"),
                bgcolor='rgba(255,255,255,0.8)',
                bordercolor='#059669',
                borderwidth=1
            )
    
    # Flux Genset vers BESS (si Genset charge la batterie)
    if p_genset > 0 and p_bess < 0:  # BESS se charge
        genset_to_bess = min(p_genset, abs(p_bess))
        if genset_to_bess > 0:
            fig.add_annotation(
                x=0.85, y=0.2,
                ax=0.15, ay=0.3,
                arrowhead=2,
                arrowsize=1.5,
                arrowwidth=4,
                arrowcolor='#059669',
                showarrow=True
            )
            fig.add_annotation(
                x=0.85, y=0.35,
                text=f"{genset_to_bess:.0f} kW",
                showarrow=False,
                font=dict(size=12, color='#059669', family="Arial Black"),
                bgcolor='rgba(255,255,255,0.8)',
                bordercolor='#059669',
                borderwidth=1
            )
    
    # Configuration du layout (optimisé pour éviter le clignotement)
    fig.update_layout(
        title=dict(
            text="<b>Flux de Puissance du Micro-réseau</b>",
            x=0.5,
            font=dict(size=20, color='#2c3e50')
        ),
        xaxis=dict(
            showgrid=False,
            zeroline=False,
            showticklabels=False,
            range=[-0.2, 1.2],
            fixedrange=True  # Empêche le zoom/pan qui peut causer du clignotement
        ),
        yaxis=dict(
            showgrid=False,
            zeroline=False,
            showticklabels=False,
            range=[-1.5, 1.5],
            fixedrange=True  # Empêche le zoom/pan qui peut causer du clignotement
        ),
        plot_bgcolor='rgba(248,250,252,0.8)',  # Fond légèrement coloré pour le contraste
        paper_bgcolor='rgba(255,255,255,1)',   # Fond blanc pour la lisibilité
        width=900,
        height=700,
        showlegend=False,
        margin=dict(l=50, r=50, t=80, b=50),
        autosize=False,  # Désactive l'auto-resize qui peut causer du clignotement
        hovermode='closest'  # Améliore les interactions
    )
    
    # Ajout d'un fond dégradé moderne
    fig.add_shape(
        type="rect",
        x0=-0.2, y0=-1.5, x1=1.2, y1=1.5,
        fillcolor="rgba(240,248,255,0.5)",
        layer="below",
        line=dict(width=0)  # Pas de bordure
    )
    
    return fig

def render_power_flow_chart(data):
    """
    Affiche le graphique de flux de puissance dans Streamlit
    """
    # Titre simple et lisible
    st.markdown("### ⚡ Flux de Puissance en Temps Réel")
    st.markdown("---")
    
    # Création et affichage du graphique
    fig = create_power_flow_chart(data)
    st.plotly_chart(fig, use_container_width=True, config={'displayModeBar': False})
    
    # Légende simple
    st.markdown("""
    <div style="
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 10px;
        margin: 10px 0;
        border-left: 4px solid #007bff;
    ">
        <strong>💡 Légende :</strong> Les flèches montrent la direction et l'intensité des flux de puissance entre les composants
    </div>
    """, unsafe_allow_html=True)
