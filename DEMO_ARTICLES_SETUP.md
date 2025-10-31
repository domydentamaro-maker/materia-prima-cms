# Setup Articoli Demo

Per inserire gli articoli demo nel database, segui questi passaggi:

## 1. Crea un Utente Admin

1. Registrati sul sito usando il form di login (`/login`)
2. Accedi al backend Lovable Cloud cliccando sul pulsante in basso nel messaggio
3. Vai alla tabella `profiles`
4. Trova il tuo profilo e imposta `is_admin = true`

## 2. Inserisci gli Articoli Demo

Una volta che sei admin, puoi inserire gli articoli direttamente dalla dashboard admin (`/admin`) usando il pulsante "Nuovo Articolo", oppure puoi eseguire questo SQL dal backend:

```sql
-- Inserisci articoli demo
INSERT INTO articles (
  title,
  subtitle,
  slug,
  content,
  cover_image,
  category_id,
  status,
  published_at,
  author_id,
  views_count
) 
SELECT 
  title,
  subtitle,
  slug,
  content,
  cover_image,
  category_id,
  status,
  published_at,
  (SELECT id FROM profiles WHERE is_admin = true LIMIT 1),
  views_count
FROM (VALUES
  (
    'L''INNOVAZIONE NEL SETTORE EDILIZIO: BIM E DIGITALIZZAZIONE',
    'Come la tecnologia sta trasformando il modo di progettare e costruire',
    'innovazione-settore-edilizio-bim-digitalizzazione',
    '<p>L''edilizia sta vivendo una <strong>rivoluzione digitale</strong> senza precedenti. Il Building Information Modeling (BIM) rappresenta oggi il punto di riferimento per la progettazione integrata.</p>

<h2>Il Futuro è Digitale</h2>
<p>La digitalizzazione dei processi costruttivi permette di:</p>
<ul>
<li>Ridurre gli errori in fase di progettazione</li>
<li>Ottimizzare i tempi e i costi</li>
<li>Migliorare la collaborazione tra i team</li>
</ul>

<p>Per approfondire, visita il nostro <a href="/chi-siamo">team di esperti</a> o consulta le <a href="https://www.buildingsmart.org/" target="_blank">linee guida internazionali BIM</a>.</p>

<h2>Case Study</h2>
<p>Nel nostro ultimo progetto abbiamo ridotto i costi del 20% grazie all''implementazione del BIM. <a href="/contatti">Contattaci</a> per saperne di più.</p>',
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200',
    (SELECT id FROM categories WHERE name = 'Innovazione' LIMIT 1),
    'published'::article_status,
    '2025-01-15 10:00:00'::timestamp,
    342
  ),
  (
    'SOSTENIBILITÀ ED EFFICIENZA ENERGETICA: IL NUOVO STANDARD',
    'Costruire oggi pensando al domani: materiali eco-compatibili e certificazioni green',
    'sostenibilita-efficienza-energetica-nuovo-standard',
    '<p>La <strong>sostenibilità ambientale</strong> non è più un''opzione, ma una necessità. Gli edifici ad alta efficienza energetica rappresentano il futuro dell''edilizia.</p>

<h2>Certificazioni e Standard</h2>
<p>Le principali certificazioni includono:</p>
<ul>
<li><strong>LEED</strong> - Leadership in Energy and Environmental Design</li>
<li><strong>CasaClima</strong> - Standard italiano per l''efficienza</li>
<li><strong>WELL</strong> - Benessere degli occupanti</li>
</ul>

<p>Scopri di più sui nostri <a href="/archivio">progetti sostenibili</a> o visita il sito della <a href="https://www.usgbc.org/" target="_blank">USGBC</a>.</p>

<h2>Materiali Innovativi</h2>
<p>Utilizziamo materiali naturali e riciclabili per ridurre l''impatto ambientale. <a href="/contatti">Richiedi una consulenza</a> personalizzata.</p>',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200',
    (SELECT id FROM categories WHERE name = 'Sostenibilità' LIMIT 1),
    'published'::article_status,
    '2025-02-10 14:30:00'::timestamp,
    287
  ),
  (
    'RIGENERAZIONE URBANA: VALORIZZARE IL TERRITORIO',
    'Trasformare spazi dismessi in nuove opportunità per la comunità',
    'rigenerazione-urbana-valorizzare-territorio',
    '<p>La <strong>rigenerazione urbana</strong> è una pratica sempre più diffusa che mira a dare nuova vita a zone degradate o abbandonate delle città.</p>

<h2>Perché è Importante</h2>
<p>Rigenerare significa:</p>
<ol>
<li>Recuperare il patrimonio edilizio esistente</li>
<li>Ridurre il consumo di suolo</li>
<li>Creare valore per la comunità</li>
<li>Promuovere la mobilità sostenibile</li>
</ol>

<p>Visita la nostra sezione <a href="/">progetti recenti</a> o approfondisci con le <a href="https://www.un.org/sustainabledevelopment/" target="_blank">linee guida ONU</a> sullo sviluppo sostenibile.</p>

<h2>Il Nostro Approccio</h2>
<p>Ogni progetto viene studiato per integrarsi armoniosamente nel contesto urbano esistente. <a href="/chi-siamo">Scopri il nostro metodo</a>.</p>',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200',
    (SELECT id FROM categories WHERE name = 'Progetti' LIMIT 1),
    'published'::article_status,
    '2025-03-05 09:15:00'::timestamp,
    156
  ),
  (
    'DESIGN E FUNZIONALITÀ: L''EQUILIBRIO PERFETTO',
    'Quando l''estetica incontra la praticità negli spazi abitativi moderni',
    'design-funzionalita-equilibrio-perfetto',
    '<p>Un progetto edilizio di successo deve coniugare <strong>bellezza estetica</strong> e <strong>funzionalità pratica</strong>. L''architettura contemporanea ci insegna che questi due aspetti non sono in contraddizione.</p>

<h2>Principi di Progettazione</h2>
<p>I nostri progetti seguono questi principi:</p>
<ul>
<li>Massimizzare la luce naturale</li>
<li>Ottimizzare gli spazi</li>
<li>Scegliere materiali di qualità</li>
<li>Integrare tecnologia e comfort</li>
</ul>

<p>Esplora il nostro <a href="/archivio">archivio progetti</a> o visita <a href="https://www.archdaily.com/" target="_blank">ArchDaily</a> per l''ispirazione internazionale.</p>

<h2>Personalizzazione</h2>
<p>Ogni cliente ha esigenze uniche. <a href="/contatti">Raccontaci</a> la tua visione e la trasformeremo in realtà.</p>',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200',
    (SELECT id FROM categories WHERE name = 'Innovazione' LIMIT 1),
    'published'::article_status,
    '2025-04-20 16:45:00'::timestamp,
    423
  ),
  (
    'IL MERCATO IMMOBILIARE NEL 2025: TREND E PREVISIONI',
    'Analisi del settore e opportunità per investitori e costruttori',
    'mercato-immobiliare-2025-trend-previsioni',
    '<p>Il <strong>mercato immobiliare</strong> sta attraversando una fase di trasformazione. Nuove tecnologie, sostenibilità e cambiamenti demografici stanno ridefinendo le regole del gioco.</p>

<h2>I Trend Principali</h2>
<p>Cosa aspettarsi nei prossimi anni:</p>
<ol>
<li><strong>Smart Buildings</strong> - edifici connessi e intelligenti</li>
<li><strong>Cohousing</strong> - spazi condivisi e comunità</li>
<li><strong>Flessibilità</strong> - ambienti adattabili alle esigenze</li>
<li><strong>Green Premium</strong> - valore aggiunto degli edifici sostenibili</li>
</ol>

<p>Leggi l''analisi completa sul <a href="https://www.ilsole24ore.com/" target="_blank">Sole 24 Ore</a> o <a href="/contatti">richiedi una consulenza</a> personalizzata.</p>

<h2>Investire Oggi</h2>
<p>Le opportunità sono molte per chi sa guardare avanti. <a href="/chi-siamo">Il nostro team</a> è pronto ad affiancarti.</p>',
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200',
    (SELECT id FROM categories WHERE name = 'Mercato' LIMIT 1),
    'published'::article_status,
    '2025-05-12 11:20:00'::timestamp,
    198
  )
) AS demo(title, subtitle, slug, content, cover_image, category_id, status, published_at, views_count);

-- Inserisci i tag per gli articoli
INSERT INTO article_tags (article_id, tag_id)
SELECT 
  a.id,
  t.id
FROM articles a
CROSS JOIN tags t
WHERE a.slug IN (
  'innovazione-settore-edilizio-bim-digitalizzazione',
  'sostenibilita-efficienza-energetica-nuovo-standard',
  'rigenerazione-urbana-valorizzare-territorio',
  'design-funzionalita-equilibrio-perfetto',
  'mercato-immobiliare-2025-trend-previsioni'
)
AND (
  (a.slug = 'innovazione-settore-edilizio-bim-digitalizzazione' AND t.name IN ('Edilizia', 'BIM', 'Tecnologia'))
  OR (a.slug = 'sostenibilita-efficienza-energetica-nuovo-standard' AND t.name IN ('Green Building', 'Efficienza Energetica'))
  OR (a.slug = 'rigenerazione-urbana-valorizzare-territorio' AND t.name IN ('Urbanistica', 'Design'))
  OR (a.slug = 'design-funzionalita-equilibrio-perfetto' AND t.name IN ('Design', 'Edilizia'))
  OR (a.slug = 'mercato-immobiliare-2025-trend-previsioni' AND t.name IN ('Edilizia', 'Tecnologia'))
);
```

## Note

- Gli articoli contengono **link attivi** sia interni (navigazione nel sito) che esterni (link a risorse esterne)
- Il contenuto è formattato con **HTML** (grassetto, titoli, liste, paragrafi)
- Le immagini di copertina provengono da Unsplash
- Ogni articolo ha tag e categorie assegnate
