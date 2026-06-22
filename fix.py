import os
import re

html_path = r'd:\Design & Jobs\@MVP\Encontro com Deus\Teatro\Caminho da Cruz\WebApp\index.html'
css_path = r'd:\Design & Jobs\@MVP\Encontro com Deus\Teatro\Caminho da Cruz\WebApp\style.css'

with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# Remove character specific stage-direction rules to allow global styles
css = re.sub(r'\.c-[a-zA-Z0-9_-]+\s+\.stage-direction\s*\{[^}]+\}', '', css)

new_styles = '''
/* Stage Directions (Rubricas) */
.stage-direction {
    display: inline-flex; align-items: flex-start; gap: 8px; font-size: 0.9rem; font-weight: 600; font-style: normal;
    padding: 8px 14px; border-radius: 8px; border: 1px solid transparent;
    margin: 8px 0; line-height: 1.4; box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}
.stage-direction i { margin-top: 3px; font-size: 1rem; }

/* Tipos de Rubricas Globais */
.sd-action { background: #fff7ed; border-color: #fed7aa; color: #c2410c; }
.sd-action i { color: #f97316; }

.sd-emotion { background: #faf5ff; border-color: #e9d5ff; color: #7e22ce; }
.sd-emotion i { color: #a855f7; }

.sd-tech { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
.sd-tech i { color: #22c55e; }

.sd-audio { background: #f0f9ff; border-color: #bae6fd; color: #0369a1; }
.sd-audio i { color: #0ea5e9; }

.block-direction { display: flex; gap: 12px; margin: 16px 0; padding: 16px; border-radius: 12px; background: #1e293b; color: #f8fafc; border-left: 4px solid #38bdf8; font-weight: 500; }
.block-direction i { font-size: 1.4rem; color: #38bdf8; }
'''

# replace the old stage direction base styles
css = re.sub(r'/\* Stage Directions \(Rubricas\) \*/(.|\n)*?(?=\/\* Target Tags \*/)', new_styles + '\n\n', css)

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

replacements = [
    (r'\[Pausa. Deixar o som ambiente falar por si\]', '<i class="fa-solid fa-volume-high"></i> Pausa. Deixar o som ambiente falar por si', 'sd-audio'),
    (r'\[Solta a trilha sonora\]', '<i class="fa-solid fa-music"></i> Solta a trilha sonora', 'sd-audio'),
    (r'\[Jesus entra ao longe, carregando a cruz, sendo açoitado por dois soldados. Atrás, as mulheres seguem chorando e lamentando.\]', '<i class="fa-solid fa-person-walking"></i> Jesus entra ao longe, carregando a cruz, sendo açoitado por dois soldados. Atrás, as mulheres seguem chorando e lamentando.', 'sd-action'),
    (r'\[Açoita Jesus e fala diretamente a Ele\]', '<i class="fa-solid fa-hand-fist"></i> Açoita Jesus e fala diretamente a Ele', 'sd-action'),
    (r'\[Interage com platéia\]', '<i class="fa-solid fa-users"></i> Interage com platéia', 'sd-emotion'),
    (r'\[Choram um pouco mais alto\]', '<i class="fa-solid fa-face-sad-tear"></i> Choram um pouco mais alto', 'sd-emotion'),
    (r'\[Risos\]', '<i class="fa-solid fa-face-laugh"></i> Risos', 'sd-emotion'),
    (r'\[Jesus continua caminhando até chegar diante de Simão de Cirene que está no corredor com os encontristas. Em frente a ele, Jesus perde as forças e cai sob o peso da cruz.\]', '<i class="fa-solid fa-person-falling"></i> Jesus continua caminhando até chegar diante de Simão de Cirene que está no corredor com os encontristas. Em frente a ele, Jesus perde as forças e cai sob o peso da cruz.', 'sd-action'),
    (r'\[Olha ao redor e puxam Simão do meio do corredor.\]', '<i class="fa-solid fa-eye"></i> Olha ao redor e puxam Simão do meio do corredor.', 'sd-action'),
    (r'\[Simão ajuda Jesus a levantar e passa a carregar a cruz junto com Ele até o local da crucificação.\]', '<i class="fa-solid fa-handshake-angle"></i> Simão ajuda Jesus a levantar e passa a carregar a cruz junto com Ele até o local da crucificação.', 'sd-action'),
    (r'\[Enquanto Eles caminham a narradora continua\]', '<i class="fa-solid fa-microphone"></i> Enquanto Eles caminham a narradora continua', 'sd-action'),
    (r'\[Ao chegarem no ponto onde irão colocar a cruz os soldados retiram a cruz de Jesus e a colocam no chão, no ponto onde será levantada depois.\]', '<i class="fa-solid fa-map-location-dot"></i> Ao chegarem no ponto onde irão colocar a cruz os soldados retiram a cruz de Jesus e a colocam no chão, no ponto onde será levantada depois.', 'sd-action'),
    (r'\[Soldado empurra Simão para fora da cena. Simão recua triste olhando para Jesus.\]', '<i class="fa-solid fa-arrow-right-from-bracket"></i> Soldado empurra Simão para fora da cena. Simão recua triste olhando para Jesus.', 'sd-action'),
    (r'\[Jesus é colocado de joelhos diante da cruz olhando para todos os encontristas.\]', '<i class="fa-solid fa-person-praying"></i> Jesus é colocado de joelhos diante da cruz olhando para todos os encontristas.', 'sd-action'),
    (r'\[Soldado pega a coroa de espinhos que deve estar no chão já no local e se aproxima lentamente de Jesus.\]', '<i class="fa-solid fa-crown"></i> Soldado pega a coroa de espinhos que deve estar no chão já no local e se aproxima lentamente de Jesus.', 'sd-action'),
    (r'\[A coroa é colocada na cabeça de Jesus. O líquido vermelho começa a escorrer de forma sutil.\]', '<i class="fa-solid fa-droplet"></i> A coroa é colocada na cabeça de Jesus. O líquido vermelho começa a escorrer de forma sutil.', 'sd-action'),
    (r'\[Um Soldado levanta a Cruz e o outro Jesus.\]', '<i class="fa-solid fa-arrow-up"></i> Um Soldado levanta a Cruz e o outro Jesus.', 'sd-action'),
    (r'\[Soldado prepara a primeira mão. O martelo deve ser audível e ensaiado.\]', '<i class="fa-solid fa-hammer"></i> Soldado prepara a primeira mão. O martelo deve ser audível e ensaiado.', 'sd-audio'),
    (r'\[Silêncio longo. Mulheres choram aos pés da cruz ou próximas da cena.\]', '<i class="fa-solid fa-volume-xmark"></i> Silêncio longo. Mulheres choram aos pés da cruz ou próximas da cena.', 'sd-emotion'),
    (r'\[Jesus ergue a cabeça com dificuldade.\]', '<i class="fa-solid fa-person"></i> Jesus ergue a cabeça com dificuldade.', 'sd-action'),
    (r'\[Pausa longa. Deixar a frase pesar no ambiente.\]', '<i class="fa-solid fa-hourglass-half"></i> Pausa longa. Deixar a frase pesar no ambiente.', 'sd-tech'),
    (r'\[Jesus inclina a cabeça lentamente pro alto e depois morre.\]', '<i class="fa-solid fa-cross"></i> Jesus inclina a cabeça lentamente pro alto e depois morre.', 'sd-action'),
    (r'\[Silêncio absoluto por alguns segundos.\]', '<i class="fa-solid fa-volume-xmark"></i> Silêncio absoluto por alguns segundos.', 'sd-tech'),
    (r'\[Soldados retiram Jesus da cruz e o carregam para fora da cena. Mulheres e o Cireneu acompanham.\]', '<i class="fa-solid fa-arrow-right-from-bracket"></i> Soldados retiram Jesus da cruz e o carregam para fora da cena. Mulheres e o Cireneu acompanham.', 'sd-action'),
    (r'\[Com Jesus fora da cena\]', '<i class="fa-solid fa-eye-slash"></i> Com Jesus fora da cena', 'sd-tech'),
    (r'\[Os encontristas começam a colocar os papéis no recipiente. A equipe auxilia com ordem e segurança. Um de cada vez.\]', '<i class="fa-solid fa-fire"></i> Os encontristas começam a colocar os papéis no recipiente. A equipe auxilia com ordem e segurança. Um de cada vez.', 'sd-action'),
    (r'\[ORAÇÃO PELOS PAPÉIS QUEIMADOS\]', '<i class="fa-solid fa-hands-praying"></i> ORAÇÃO PELOS PAPÉIS QUEIMADOS', 'sd-emotion'),
    (r'\[Preparar discretamente Jesus ressuscitado no ponto combinado.\]', '<i class="fa-solid fa-user-ninja"></i> Preparar discretamente Jesus ressuscitado no ponto combinado.', 'sd-tech'),
    (r'\[Bastante impacto\]', '<i class="fa-solid fa-bolt"></i> Bastante impacto', 'sd-emotion'),
    (r'\[A luz acende no local e Jesus aparece ressuscitado, com roupa branca, coroa e faixa vermelha.\]', '<i class="fa-solid fa-lightbulb"></i> A luz acende no local e Jesus aparece ressuscitado, com roupa branca, coroa e faixa vermelha.', 'sd-tech'),
    (r'\[Ficam alguns minutos glorificando e adorando o PAI.\]', '<i class="fa-solid fa-hands-praying"></i> Ficam alguns minutos glorificando e adorando o PAI.', 'sd-emotion'),
    (r'\[O Palestrante assume\]', '<i class="fa-solid fa-microphone"></i> O Palestrante assume', 'sd-action')
]

for text, content, cls in replacements:
    html = re.sub(r'<span class="stage-direction">' + text + r'</span>', f'<span class="stage-direction {cls}">{content}</span>', html)

# Some of these stage directions might have been written manually without tags or the user just wants the icons
with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
