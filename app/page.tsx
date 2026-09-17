import Image from 'next/image'
import Fx from './fx'
import LeadForm from './lead-form'
import Testimonials from './testimonials'

/* =========================================================
   CONFIGURAÇÃO DO EVENTO
   Ajuste aqui: data/hora da aula e headline ativa.
   ========================================================= */
const EVENTO = {
  data: '05/10',
  diaSemana: 'segunda',
  hora: '20h',
  formato: 'Ao vivo e gratuita',
}

/* Opções de headline mandadas pelo Davi (troque HEADLINE_ATIVA):
   0 - Descubra em 1 aula gratuita o passo a passo para ser aprovado na OAB 48
   1 - Saia do zero e seja aprovado em 90 dias na OAB 48
   2 - Eu vou te provar que em 90 dias de foco você vai ser aprovado na OAB 48
   3 - O melhor cronograma para ser aprovado na primeira prova da OAB de 2027
   4 - O passo a passo definitivo para ser aprovado na OAB 48
   5 - Descubra em primeira mão o maior lançamento do Método VDE           */
const HEADLINE_ATIVA = 2

const HEADLINES = [
  <>Descubra em <span className="grad-text">1 aula&nbsp;gratuita</span> o passo a passo para ser aprovado na <span className="grad-text">OAB&nbsp;48</span>.</>,
  <>Saia do zero e seja aprovado <span className="grad-text">em 90&nbsp;dias</span> na <span className="grad-text">OAB&nbsp;48</span>.</>,
  <>Eu vou te provar que em <span className="grad-text">90 dias de&nbsp;foco</span> você vai ser aprovado na <span className="grad-text">OAB&nbsp;48</span>.</>,
  <>O melhor <span className="grad-text">cronograma</span> para ser aprovado na primeira prova da <span className="grad-text">OAB de&nbsp;2027</span>.</>,
  <>O passo a passo <span className="grad-text">definitivo</span> para ser aprovado na <span className="grad-text">OAB&nbsp;48</span>.</>,
  <>Descubra em primeira mão o <span className="grad-text">maior lançamento</span> do Método VDE.</>,
]

/* Calendário oficial OAB 48 (divulgado pela OAB em 21/05/2026; confirmar no edital) */
const DATAS = [
  { lab: 'Edital', day: '21/09', desc: 'Publicação prevista do edital do 48º Exame de Ordem.', hl: false },
  { lab: 'Inscrições', day: '28/09 a 05/10', desc: 'Período previsto de inscrição no site da FGV.', hl: false },
  { lab: '1ª fase', day: '10/01/2027', desc: 'Prova objetiva: 80 questões, você precisa acertar 40.', hl: true },
  { lab: 'Cronograma VDE', day: '12/10/2026', desc: 'Início do cronograma de 90 dias do Método VDE.', hl: false },
]

const PASSOS = [
  { t: 'Resumo direcionado', p: 'Você pré-estuda o conteúdo lendo resumos objetivos, que dão a base do assunto sem perder tempo com o que não cai.' },
  { t: 'Questões comentadas', p: 'Depois faz questões da FGV para contextualizar o conteúdo e se acostumar com o jeito que a banca cobra.' },
  { t: 'Lei seca', p: 'Mais de 90% das questões da OAB são fundamentadas na lei seca, por isso a leitura entra no cronograma todo dia.' },
  { t: 'Videoaulas', p: 'Ficam para os assuntos mais difíceis ou para as disciplinas em que você tem mais dificuldade. Não são o centro do estudo.' },
  { t: 'Revisão', p: 'Em 90 dias você estuda centenas de conteúdos. Sem revisões frequentes e bem feitas é impossível lembrar de tudo na prova.' },
]

/* Depoimentos reais: prints das mensagens dos alunos aprovados com o
   cronograma de 90 dias (enviados pelo Davi em 17/09/2026).
   Arquivos em public/depoimentos/. */
const DEPOIMENTOS = [
  { src: '/depoimentos/dep-46-pontos.png', w: 764, h: 810, alt: 'Aluna aprovada com 46 pontos: o cronograma de 90 dias foi essencial e passou de primeira.' },
  { src: '/depoimentos/dep-55-80.png', w: 1052, h: 672, alt: 'Aluna aprovada com 55 de 80 na primeira tentativa, no 9º período, com o VDE 90 dias.' },
  { src: '/depoimentos/dep-49-80.png', w: 588, h: 458, alt: 'Aluna aprovada com 49 de 80, mãe de 2 e com rotina cheia, usando o cronograma de 90 dias.' },
  { src: '/depoimentos/dep-solenidade.png', w: 834, h: 316, alt: 'Aluna aprovada depois de 2 reprovações e 4 anos de formada, com o cronograma de 90 dias.' },
  { src: '/depoimentos/dep-41-pontos.png', w: 1034, h: 380, alt: 'Aluno aprovado com 41 pontos depois do curso de 90 dias.' },
]

const IconLive = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M6.3 6.3a9 9 0 0 0 0 12.7M17.7 6.3a9 9 0 0 1 0 12.7M3.5 3.5a13 13 0 0 0 0 17M20.5 3.5a13 13 0 0 1 0 17" /></svg>
)
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4m8-4v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></svg>
)
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
)

export default function Page() {
  return (
    <>
      <Fx />


      {/* SEÇÃO 1: Hero + captura
          (o wrapper branco existe para os cantos arredondados do hero
          revelarem branco, e não o cinza do fundo do body) */}
      <div className="hero-bleed">
      <section className="hero" id="topo">
        <div className="wrap">
          <div className="hero-logo">
            <Image src="/logo-branca1f.svg" alt="Método VDE 1ª Fase" width={203} height={65} priority />
          </div>
          <h1>{HEADLINES[HEADLINE_ATIVA]}</h1>
          <h2 className="hero-sub">
            Em <b>1 aula gratuita e ao vivo</b> no dia <b>{EVENTO.data}</b>, às{' '}
            <b>{EVENTO.hora}</b>, você vai ter acesso ao passo a passo que já
            aprovou <b>+100 mil alunos</b>.
          </h2>

          <div className="hero-meta">
            <span className="meta"><span className="ck"><IconCalendar /></span>{EVENTO.data}</span>
            <span className="meta"><span className="ck"><IconClock /></span>{EVENTO.hora}</span>
            <span className="meta"><span className="ck"><IconLive /></span>{EVENTO.formato}</span>
          </div>

          <div className="capture" id="inscricao">
            <LeadForm />
          </div>
        </div>
      </section>
      </div>

      {/* SEÇÃO 2: Datas importantes */}
      <section className="sec sec-white">
        <div className="wrap">
          <div className="sec-head reveal">
            <p className="sec-eyebrow">Datas essenciais para a <span className="grad-text">OAB&nbsp;48</span></p>
          </div>
          <div className="dates reveal">
            {DATAS.map((d) => (
              <div className={`date-card${d.hl ? ' hl' : ''}`} key={d.lab}>
                <div className="lab">{d.lab}</div>
                <div className={`day${d.hl ? '' : ' grad-text'}`}>{d.day}</div>
                <div className="desc">{d.desc}</div>
              </div>
            ))}
          </div>
          <p className="date-note">Datas conforme calendário divulgado pela OAB. Podem ser ajustadas no edital.</p>
        </div>
      </section>

      {/* SEÇÃO 3: Passo a passo do Método */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-head reveal">
            <h2>O passo a passo do Método que já aprovou <span className="grad-text">+100 mil&nbsp;alunos</span></h2>
            <p>É a mesma sequência que já levou milhares de alunos à aprovação. Na aula eu mostro como ela cabe em 90 dias.</p>
          </div>
          <div className="timeline">
            {PASSOS.map((s, i) => (
              <div className={`tl-item reveal${i % 2 ? ' left' : ''}`} key={s.t}>
                <span className="tl-dot" />
                <div className="tl-body">
                  <span className="step-chip">{i + 1}º passo</span>
                  <h3 className="grad-text">{s.t}</h3>
                  <p>{s.p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: Depoimentos */}
      <section className="sec">
        <div className="wrap">
          <div className="dep-box reveal">
            <div className="dep-side">
              <h2>O que os alunos falam do <span className="grad-text">VDE 1ª&nbsp;Fase</span>?</h2>
            </div>
            <Testimonials items={DEPOIMENTOS} />
          </div>
        </div>
      </section>

      {/* SEÇÃO 5: Quem é o Método VDE (faixa com o degradê oficial da marca) */}
      <section className="sec sec-brand">
        <div className="wrap">
          <div className="sec-head reveal">
            <h2>O Método VDE já aprovou <span className="grad-text">+100 mil&nbsp;alunos</span> na OAB</h2>
            <p>Você vai estudar com quem mais entende do Exame de Ordem no Brasil.</p>
          </div>
          <div className="stats reveal">
            <div className="stat"><strong className="grad-text">+100.000</strong><span>aprovados na OAB</span></div>
            <div className="stat"><strong className="grad-text">+8 anos</strong><span>trabalhando com o Exame de Ordem</span></div>
            <div className="stat"><strong className="grad-text">+120 mil</strong><span>livros vendidos pela Editora Juspodivm</span></div>
          </div>
          <div className="cta-band reveal">
            <a className="btn btn-light btn-lg" href="#inscricao">Quero minha vaga na aula gratuita</a>
          </div>
        </div>
      </section>

      <footer className="site">
        <div className="wrap foot">
          <Image src="/logo-cor1f.svg" alt="Método VDE 1ª Fase" width={140} height={36} />
          <p className="legal">
            Método VDE é um curso preparatório independente da Vício de uma
            Estudante, sem vínculo com a OAB ou a FGV. Vício de Uma Estudante ©{' '}
            {new Date().getFullYear()}. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </>
  )
}
