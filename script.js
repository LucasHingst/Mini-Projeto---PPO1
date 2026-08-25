//vetor com as curiosidades
const curiosidades = [
  "O GP do Canadá é disputado no Circuito Gilles Villeneuve, nomeado em homenagem ao lendário piloto canadense.",
  "Um carro de Fórmula 1 pode andar de cabeça para baixo em um teto se atingir velocidade suficiente, devido à força aerodinâmica (downforce).",
  "Os pilotos de F1 podem perder até 4 kg de peso corporal durante uma única corrida devido ao calor e ao esforço físico.",
  "Os pneus de F1 operam em temperaturas ideais acima de 100°C para garantir a máxima aderência no asfalto.",
  "A troca de pneus mais rápida da história da F1 durou apenas 1.80 segundo (McLaren, GP do Catar de 2023).",
  "Um capacete de Fórmula 1 é submetido a testes extremos, incluindo chamas a 800°C por vários segundos antes de ser homologado.",
  "O volante de um F1 moderno possui mais de 20 botões e seletores para controlar quase todas as funções do carro.",
  "Michael Schumacher e Lewis Hamilton mantêm o recorde empatado de 7 títulos mundiais de Fórmula 1 cada.",
  "O GP de Mônaco é a corrida mais curta do calendário em distância total (260 km), mas uma das mais exigentes.",
  "Os freios de disco de carbono de um F1 podem atingir temperaturas superiores a 1.000°C durante frenagens intensas."
];

function showSection(sectionId) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => section.classList.remove('active'));

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  const factText = document.getElementById('fact-display');
  if (sectionId === 'curiosidades' && factText && factText.innerText.includes('Clique no botão')) {
    generateRandomFact();
  }
}


function generateRandomFact() {
  const randomIndex = Math.floor(Math.random() * curiosidades.length);
  const selectedFact = curiosidades[randomIndex];

  const factDisplay = document.getElementById('fact-display');
  const factCounter = document.getElementById('fact-counter');

  if (factDisplay && factCounter) {
    factDisplay.innerText = selectedFact;
    factCounter.innerText = `${randomIndex + 1} / ${curiosidades.length}`;
  }
}
async function loadNextRace() {
  const container = document.getElementById('race-details-container');
  const circuitImg = document.getElementById('circuit-img');
  const circuitPlaceholder = document.getElementById('circuit-placeholder');

  try {
    const response = await fetch('https://api.jolpi.ca/ergast/f1/current/next.json');
    const data = await response.json();
    const race = data.MRData.RaceTable.Races[0];

    if (race) {
      proximaCorridaDados = race;
      const raceDate = new Date(`${race.date}T${race.time || '00:00:00Z'}`);
      const formattedDate = raceDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

      // 1. Preenche os dados de texto da corrida
      container.innerHTML = `
        <h3>${race.raceName.toUpperCase()}</h3>
        <p>${race.Circuit.circuitName}</p>
        <p>📅 ${formattedDate}</p>
        <p>📍 ${race.Circuit.Location.locality}, ${race.Circuit.Location.country}</p>
      `;

      // 2. Monta a URL dinâmica do traçado usando o circuitId da API
      const circuitId = race.Circuit.circuitId;
      
      // O repositório f1-circuits disponibiliza os vetores padronizados pelo ID da API Ergast
      const imageUrl = `https://raw.githubusercontent.com/f1-circuits/f1-circuits/main/circuits/${circuitId}.svg`;

      // 3. Renderiza a imagem
      circuitImg.src = imageUrl;
      circuitImg.onload = () => {
        circuitImg.style.display = 'block';
        circuitPlaceholder.style.display = 'none';
      };

      // Trata caso a imagem do circuito não seja encontrada no repositório
      circuitImg.onerror = () => {
        circuitImg.style.display = 'none';
        circuitPlaceholder.style.display = 'block';
        circuitPlaceholder.innerText = '[ Traçado Indisponível ]';
      };
    }
  } catch (error) {
    console.error('Erro ao carregar dados da API:', error);
    container.innerHTML = `
      <h3>GRANDE PRÊMIO</h3>
      <p>Informações indisponíveis no momento.</p>
    `;
  }
}

// Executa a busca assim que a página é carregada
document.addEventListener('DOMContentLoaded', loadNextRace);