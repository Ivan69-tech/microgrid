# Guide Visuel - Schéma de Flux d'Énergie Microgrid

## 🎯 Résultat Final

Le nouveau schéma de flux d'énergie présente un design moderne inspiré des interfaces SCADA industrielles avec les
caractéristiques suivantes :

### 📱 Layout Responsive

```
┌─────────────────────────────────────────────────────────┐
│  🌞 Centrale Photovoltaïque                            │
│      [Icône SVG Soleil] 12.5 kW                       │
│      Production solaire                                 │
└─────────────────────────────────────────────────────────┘
                           ↓ (Flux animé)
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ 🔋 BESS     │  │ ⚡ Réseau   │  │ 🏭 Charge   │
│ [Icône SVG] │  │ [Icône SVG] │  │ [Icône SVG] │
│ 5.2 kW      │  │ Stable      │  │ 8.1 kW      │
│ SOC: 75%    │  │             │  │             │
│ Charge      │  │             │  │             │
└─────────────┘  └─────────────┘  └─────────────┘
      ↑               ↑               ↑
   (Flux animé)   (Centre du       (Flux animé)
                   système)
                           ↓ (Flux animé)
┌─────────────────────────────────────────────────────────┐
│  🔧 Groupe Électrogène                                 │
│      [Icône SVG Générateur] 0.0 kW                    │
│      Production de secours                              │
└─────────────────────────────────────────────────────────┘
```

### 🎨 Thèmes de Couleur

#### Mode Clair

- **Background** : Dégradé slate-50 → blue-50
- **Cards** : Blanc avec bordures grises subtiles
- **PV** : Jaune-600 (#f59e0b)
- **BESS** : Vert-600 (#10b981) / Rouge-600 (#ef4444)
- **Genset** : Bleu-600 (#3b82f6)
- **Load** : Orange-600 (#f97316)
- **Grid** : Vert-600 (stable) / Rouge-600 (blackout)

#### Mode Sombre

- **Background** : Dégradé gray-900 → blue-900
- **Cards** : Gris-800 avec bordures grises
- **PV** : Jaune-400 (#fbbf24)
- **BESS** : Vert-400 (#34d399) / Rouge-400 (#f87171)
- **Genset** : Bleu-400 (#60a5fa)
- **Load** : Orange-400 (#fb923c)
- **Grid** : Vert-400 (stable) / Rouge-400 (blackout)

### ⚡ Animations et Effets

#### Desktop (≥1024px)

- **Lignes de flux animées** : Particules lumineuses qui se déplacent
- **Gradient de couleur** : Effet de dégradé pour simuler l'énergie
- **Pulsation des icônes** : Animation selon l'état actif/inactif
- **Hover effects** : Ombres et élévations au survol

#### Mobile (<1024px)

- **Layout vertical** : Composants empilés
- **Indicateurs de flux** : Pills colorées avec animations
- **Icônes adaptées** : Tailles réduites pour mobile

### 🔧 Fonctionnalités Interactives

#### Toggle Mode Clair/Sombre

- **Bouton** : Icône soleil/batterie dans le header
- **Transition** : Animation fluide de 500ms
- **Persistance** : État conservé pendant la session

#### Flux Dynamiques

- **Seuil d'affichage** : Flux visibles si puissance > 0.1 kW
- **Direction intelligente** : Flèches adaptées au sens du flux
- **Intensité visuelle** : Opacité proportionnelle à la puissance

## 🛠️ Implémentation Technique

### Structure des Composants

```tsx
PowerFlowDiagram/
├── SVGIcon (Composant réutilisable)
├── AnimatedFlowLine (Lignes de flux)
├── PowerFlowDiagram (Composant principal)
└── Styles CSS (Animations keyframes)
```

### Icônes SVG Personnalisées

- **Battery** : Batterie avec indicateurs de charge
- **Solar** : Soleil avec rayons
- **Generator** : Générateur industriel
- **Grid** : Grille électrique
- **Load** : Bâtiment industriel
- **Warning** : Triangle d'alerte
- **Charging/Discharging** : Flèches de direction

### Animations CSS

```css
@keyframes flow-forward {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes particle-flow-forward {
  0% {
    left: -8px;
  }
  100% {
    left: calc(100% + 8px);
  }
}
```

## 📊 États Visuels

### BESS (Battery Energy Storage System)

- **Charge** : Icône "charging" + Vert + Pulsation
- **Décharge** : Icône "discharging" + Rouge + Pulsation
- **Neutre** : Icône "battery" + Gris + Statique

### Réseau (Grid)

- **Stable** : Icône "grid" + Vert + Ring vert
- **Blackout** : Icône "warning" + Rouge + Pulsation + Ring rouge

### Production (PV/Genset)

- **Actif** : Pulsation continue
- **Inactif** : Statique

## 🎯 Points Clés du Design

1. **Modernité** : Style SCADA industriel épuré
2. **Accessibilité** : Contraste élevé, tailles adaptées
3. **Performance** : Animations CSS optimisées
4. **Responsive** : Adaptation automatique aux écrans
5. **Interactivité** : Mode sombre, hover effects
6. **Lisibilité** : Typographie claire, espacement généreux

## 🚀 Utilisation

Le composant s'intègre directement dans l'application existante :

```tsx
<PowerFlowDiagram
  pv={systemStatus.P_pv}
  load={systemStatus.load}
  bess={systemStatus.P_bess}
  genset={systemStatus.P_genset}
  soc={systemStatus.SOC}
  blackout={systemStatus.blackout}
/>
```

## 📈 Améliorations Futures

- **Tooltips** : Informations détaillées au survol
- **Export** : Capture d'écran du schéma
- **Alertes** : Notifications visuelles d'état critique
- **Historique** : Visualisation temporelle des flux
- **3D Effects** : Effets de profondeur avancés
