const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
const cssPath = path.join(__dirname, 'style.css');

// 1. Update style.css
let css = fs.readFileSync(cssPath, 'utf8');

// Remove character specific stage-direction rules
css = css.replace(/\.c-[a-zA-Z0-9_-]+\s+\.stage-direction\s*\{[^}]+\}/g, '');

// Update base stage direction styles
const newStageDirectionStyles = 
/* Stage Directions (Rubricas) */
.stage-direction {
    display: inline-flex; align-items: flex-start; gap: 8px; font-size: 0.85rem; font-weight: 600; font-style: normal;
    padding: 6px 12px; border-radius: 8px; border: 1px solid transparent;
    margin: 8px 0; line-height: 1.4; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.stage-direction i { margin-top: 2px; font-size: 0.9rem; }

.block-direction { 
    display: flex; gap: 12px; margin: 16px 0; padding: 16px; 
    border-radius: 12px; background: #1e293b; color: #f8fafc; 
    border-left: 4px solid #38bdf8; font-weight: 500; font-size: 0.95rem;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}
.block-direction i { font-size: 1.5rem; color: #38bdf8; }

/* Tipos de Rubricas Globais */
.sd-action { background: #fff7ed; border-color: #fed7aa; color: #c2410c; }
.sd-action i { color: #f97316; }

.sd-emotion { background: #faf5ff; border-color: #e9d5ff; color: #7e22ce; }
.sd-emotion i { color: #a855f7; }

.sd-tech { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
.sd-tech i { color: #22c55e; }

.sd-audio { background: #f0f9ff; border-color: #bae6fd; color: #0369a1; }
.sd-audio i { color: #0ea5e9; }
;

css = css.replace(/\/\* Stage Directions \(Rubricas\) \*\/(.|\n)*?(?=\/\* Target Tags \*\/)/, newStageDirectionStyles + '\n\n');
fs.writeFileSync(cssPath, css);


// 2. Update index.html
let html = fs.readFileSync(htmlPath, 'utf8');

// The block direction already has the mask icon: <i class="fa-solid fa-masks-theater"></i> 
// We just keep it as is, the CSS upgrade will make it look great.

const replacements = [
    { text: '\\[Pausa. Deixar o som ambiente falar por si\\]', tag: '<span class="stage-direction sd-audio"><i class="fa-solid fa-volume-high"></i> Pausa. Deixar o som ambiente falar por si</span>' },
    { text: '\\[Solta a trilha sonora\\]', tag: '<span class="stage-direction sd-audio"><i class="fa-solid fa-music"></i> Solta a trilha sonora</span>' },
    { text: '\\[Jesus entra ao longe, carregando a cruz, sendo açoitado por dois soldados. Atrás, as mulheres seguem chorando e lamentando.\\]', tag: '<span class="stage-direction sd-action"><i class="fa-solid fa-person-walking"></i> Jesus entra ao longe, carregando a cruz, sendo açoitado por dois soldados. Atrás, as mulheres seguem chorando e lamentando.</span>' },
    { text: '\\[Açoita Jesus e fala diretamente a Ele\\]', tag: '<span class="stage-direction sd-action"><i class="fa-solid fa-hand-fist"></i> Açoita Jesus e fala diretamente a Ele</span>' },
    { text: '\\[Interage com platéia\\]', tag: '<span class="stage-direction sd-emotion"><i class="fa-solid fa-users"></i> Interage com platéia</span>' },
    { text: '\\[Choram um pouco mais alto\\]', tag: '<span class="stage-direction sd-emotion"><i class="fa-solid fa-face-sad-tear"></i> Choram um pouco mais alto</span>' },
    { text: '\\[Risos\\]', tag: '<span class="stage-direction sd-emotion"><i class="fa-solid fa-face-laugh"></i> Risos</span>' },
    { text: '\\[Jesus continua caminhando até chegar diante de Simão de Cirene que está no corredor com os encontristas. Em frente a ele, Jesus perde as forças e cai sob o peso da cruz.\\]', tag: '<span class="stage-direction sd-action"><i class="fa-solid fa-person-falling"></i> Jesus continua caminhando até chegar diante de Simão de Cirene que está no corredor com os encontristas. Em frente a ele, Jesus perde as forças e cai sob o peso da cruz.</span>' },
    { text: '\\[Olha ao redor e puxam Simão do meio do corredor.\\]', tag: '<span class="stage-direction sd-action"><i class="fa-solid fa-eye"></i> Olha ao redor e puxam Simão do meio do corredor.</span>' },
    { text: '\\[Simão ajuda Jesus a levantar e passa a carregar a cruz junto com Ele até o local da crucificação.\\]', tag: '<span class="stage-direction sd-action"><i class="fa-solid fa-hands-helping"></i> Simão ajuda Jesus a levantar e passa a carregar a cruz junto com Ele até o local da crucificação.</span>' },
    { text: '\\[Enquanto Eles caminham a narradora continua\\]', tag: '<span class="stage-direction sd-action"><i class="fa-solid fa-microphone"></i> Enquanto Eles caminham a narradora continua</span>' },
    { text: '\\[Ao chegarem no ponto onde irão colocar a cruz os soldados retiram a cruz de Jesus e a colocam no chão, no ponto onde será levantada depois.\\]', tag: '<span class="stage-direction sd-action"><i class="fa-solid fa-map-location-dot"></i> Ao chegarem no ponto onde irão colocar a cruz os soldados retiram a cruz de Jesus e a colocam no chão, no ponto onde será levantada depois.</span>' },
    { text: '\\[Soldado empurra Simão para fora da cena. Simão recua triste olhando para Jesus.\\]', tag: '<span class="stage-direction sd-action"><i class="fa-solid fa-arrow-right-from-bracket"></i> Soldado empurra Simão para fora da cena. Simão recua triste olhando para Jesus.</span>' },
    { text: '\\[Jesus é colocado de joelhos diante da cruz olhando para todos os encontristas.\\]', tag: '<span class="stage-direction sd-action"><i class="fa-solid fa-person-praying"></i> Jesus é colocado de joelhos diante da cruz olhando para todos os encontristas.</span>' },
    { text: '\\[Soldado pega a coroa de espinhos que deve estar no chão já no local e se aproxima lentamente de Jesus.\\]', tag: '<span class="stage-direction sd-action"><i class="fa-solid fa-crown"></i> Soldado pega a coroa de espinhos que deve estar no chão já no local e se aproxima lentamente de Jesus.</span>' },
    { text: '\\[A coroa é colocada na cabeça de Jesus. O líquido vermelho começa a escorrer de forma sutil.\\]', tag: '<span class="stage-direction sd-action"><i class="fa-solid fa-droplet"></i> A coroa é colocada na cabeça de Jesus. O líquido vermelho começa a escorrer de forma sutil.</span>' },
    { text: '\\[Um Soldado levanta a Cruz e o outro Jesus.\\]', tag: '<span class="stage-direction sd-action"><i class="fa-solid fa-arrow-up"></i> Um Soldado levanta a Cruz e o outro Jesus.</span>' },
    { text: '\\[Soldado prepara a primeira mão. O martelo deve ser audível e ensaiado.\\]', tag: '<span class="stage-direction sd-audio"><i class="fa-solid fa-hammer"></i> Soldado prepara a primeira mão. O martelo deve ser audível e ensaiado.</span>' },
    { text: '\\[Silêncio longo. Mulheres choram aos pés da cruz ou próximas da cena.\\]', tag: '<span class="stage-direction sd-emotion"><i class="fa-solid fa-volume-xmark"></i> Silêncio longo. Mulheres choram aos pés da cruz ou próximas da cena.</span>' },
    { text: '\\[Jesus ergue a cabeça com dificuldade.\\]', tag: '<span class="stage-direction sd-action"><i class="fa-solid fa-person"></i> Jesus ergue a cabeça com dificuldade.</span>' },
    { text: '\\[Pausa longa. Deixar a frase pesar no ambiente.\\]', tag: '<span class="stage-direction sd-tech"><i class="fa-solid fa-hourglass-half"></i> Pausa longa. Deixar a frase pesar no ambiente.</span>' },
    { text: '\\[Jesus inclina a cabeça lentamente pro alto e depois morre.\\]', tag: '<span class="stage-direction sd-action"><i class="fa-solid fa-cross"></i> Jesus inclina a cabeça lentamente pro alto e depois morre.</span>' },
    { text: '\\[Silêncio absoluto por alguns segundos.\\]', tag: '<span class="stage-direction sd-tech"><i class="fa-solid fa-volume-xmark"></i> Silêncio absoluto por alguns segundos.</span>' },
    { text: '\\[Soldados retiram Jesus da cruz e o carregam para fora da cena. Mulheres e o Cireneu acompanham.\\]', tag: '<span class="stage-direction sd-action"><i class="fa-solid fa-arrow-right-from-bracket"></i> Soldados retiram Jesus da cruz e o carregam para fora da cena. Mulheres e o Cireneu acompanham.</span>' },
    { text: '\\[Com Jesus fora da cena\\]', tag: '<span class="stage-direction sd-tech"><i class="fa-solid fa-eye-slash"></i> Com Jesus fora da cena</span>' },
    { text: '\\[Os encontristas começam a colocar os papéis no recipiente. A equipe auxilia com ordem e segurança. Um de cada vez.\\]', tag: '<span class="stage-direction sd-action"><i class="fa-solid fa-fire"></i> Os encontristas começam a colocar os papéis no recipiente. A equipe auxilia com ordem e segurança. Um de cada vez.</span>' },
    { text: '\\[ORAÇÃO PELOS PAPÉIS QUEIMADOS\\]', tag: '<span class="stage-direction sd-emotion"><i class="fa-solid fa-hands-praying"></i> ORAÇÃO PELOS PAPÉIS QUEIMADOS</span>' },
    { text: '\\[Preparar discretamente Jesus ressuscitado no ponto combinado.\\]', tag: '<span class="stage-direction sd-tech"><i class="fa-solid fa-user-ninja"></i> Preparar discretamente Jesus ressuscitado no ponto combinado.</span>' },
    { text: '\\[Bastante impacto\\]', tag: '<span class="stage-direction sd-emotion"><i class="fa-solid fa-bolt"></i> Bastante impacto</span>' },
    { text: '\\[A luz acende no local e Jesus aparece ressuscitado, com roupa branca, coroa e faixa vermelha.\\]', tag: '<span class="stage-direction sd-tech"><i class="fa-solid fa-lightbulb"></i> A luz acende no local e Jesus aparece ressuscitado, com roupa branca, coroa e faixa vermelha.</span>' },
    { text: '\\[Ficam alguns minutos glorificando e adorando o PAI.\\]', tag: '<span class="stage-direction sd-emotion"><i class="fa-solid fa-hands-praying"></i> Ficam alguns minutos glorificando e adorando o PAI.</span>' },
    { text: '\\[O Palestrante assume\\]', tag: '<span class="stage-direction sd-action"><i class="fa-solid fa-microphone"></i> O Palestrante assume</span>' }
];

for (const rep of replacements) {
    const regex = new RegExp('<span class="stage-direction">' + rep.text + '<\\/span>', 'g');
    html = html.replace(regex, rep.tag);
}

fs.writeFileSync(htmlPath, html);
console.log('Update complete!');
