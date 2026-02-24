-- Database schema for Ignáci imák

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prayers table
CREATE TABLE prayers (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    voice_options JSONB DEFAULT '[]',
    min_time_in_minutes INTEGER DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Steps table
CREATE TABLE steps (
    id SERIAL PRIMARY KEY,
    prayer_id INTEGER REFERENCES prayers(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    description TEXT,
    voices JSONB DEFAULT '[]',
    time_in_seconds INTEGER,
    step_type VARCHAR(50) DEFAULT 'FIX',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media metadata table
CREATE TABLE media (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    s3_key VARCHAR(500),
    media_type VARCHAR(50),
    mime_type VARCHAR(100),
    size_bytes INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_prayers_category_id ON prayers(category_id);
CREATE INDEX idx_steps_prayer_id ON steps(prayer_id);
CREATE INDEX idx_media_type ON media(media_type);

-- Insert sample data
INSERT INTO categories (title, image) VALUES 
('Ima Szentírással', 'szentiras.jpg'),
('Meditációs imák', 'meditaciosima.jpg'),
('Examen', 'examen.jpg'),
('Egyéb Döntés-Kommunikáció-Reflexió', 'egyeb.jpg');

-- Insert prayers for "Ima Szentírással" (category_id = 1)
INSERT INTO prayers (category_id, title, description, image, voice_options, min_time_in_minutes) VALUES
(1, 'Ignáci szemlélődés', 'Az ima előkészítése (5-10 perc): Elolvasom az evangéliumi szakaszt legalább kétszer - az értelmemmel és a szívemmel. Ami megérintett a szövegből, azzal kapcsolatban megfogalmazok egy kérést, ami egyszerre kapcsolódik a szöveghez és az életemhez. Ezt csak Isten ajándékozhatja nekem az Ő kegyelmeként. Eldöntöm, hol és mennyi időt (20-30-60 perc) szeretnék imában tölteni, és ima közben nem változtatok ezen.', 'ignaciszemlelodes.jpg', '["Női", "Férfi 2"]', 30),
(1, 'Ritmikus ima', 'Az ima előkészítése (5-10 perc): Elolvasom a szentírási szakaszt legalább kétszer, figyelve arra, mely szavak, mondatok, képek érintettek meg belőle. Kiválasztok belőlük egyet-kettőt; ezeket esetleg le is írom magamnak. Ami megérintett a szövegből, azzal kapcsolatban megfogalmazok egy kérést, ami egyszerre kapcsolódik a szöveghez és az életemhez.', 'ritmikusimamod.jpg', '["Női", "Férfi 2"]', 30),
(1, 'Világosság', 'Nem könnyű hűségesnek maradni önmagunkhoz. Sok minden megzavarhatja a tisztánlátásunkat azokban a dolgokban, melyek meghatározzák lényünket és életünket. Ha elvesztettem a pontos irányt, vissza kell találnom a saját utamhoz. A Biblia ebben nagyon értékes iránytű számunkra.', 'vilagossag.jpg', '["Női", "Férfi 1", "Férfi 2"]', 20);

-- Insert prayers for "Meditációs imák" (category_id = 2)
INSERT INTO prayers (category_id, title, description, image, voice_options, min_time_in_minutes) VALUES
(2, 'Belső figyelem', '… ha a mindennapok rohanásában már nem tudom, hol áll a fejem, …ha a belső irányultságomhoz való kapcsolódást elvesztem, … ha Isten halk hangját nem hallom már, akkor itt az idő, hogy kikapcsoljak.', 'belsofigyelem.jpg', '["Női", "Férfi 1", "Férfi 2"]', 15),
(2, 'Életem ritmusának megtalálása', 'Amikor a mindennapokban elvesztem lábam alól a talajt, fontos, hogy támaszt találjak. Ez az igazán jó pillanat a rózsafüzér imádkozására. A légzés ritmusában a szív megnyugszik. Ez is egy találkozás Istennel.', 'eletemritmusa.jpg', '["Női", "Férfi 1", "Férfi 2"]', 15),
(2, 'A Szív imája', 'A szív imája egy spirituális gyakorlat, amely eltökéltséget és kitartást igényel. Kiegyenesúlyozottságot ad és megszabadít a nyugtalanságtól – egy egész életen át tartó gyakorlás, hogy nyitott legyél magad felé, az életed felé, embertársaid és Isten felé.', 'szivimaja.jpg', '["Női", "Férfi 1", "Férfi 2"]', 15);

-- Insert prayers for "Examen" (category_id = 3)
INSERT INTO prayers (category_id, title, description, image, voice_options, min_time_in_minutes) VALUES
(3, 'Lelki utamon', 'Miért bosszantanak egyes dolgok és mások miért okoznak örömet? Miért cipelek magammal néhány dolgot napokig, míg másokat hamar elengedek? Aki ezeket a kérdéseket a saját mindennapjai megélése során felteszi magának, hamar egy „vakfoltot" fedez fel magában.', 'lelkiutamon.jpg', '["Női", "Férfi 1", "Férfi 2"]', 15),
(3, 'Esti Ima', 'Amikor egy nap a végéhez közeledik, akkor időt lehet szakítani egy mély lélegzetvételre és a visszatekintésre. Ilyenkor a napot tudatosan lezárom és meglátom a lehetőséget a másnapban, hogy az még jobb legyen.', 'estiima.jpg', '["Női", "Férfi 1", "Férfi 2"]', 15);

-- Insert prayers for "Egyéb Döntés-Kommunikáció-Reflexió" (category_id = 4)
INSERT INTO prayers (category_id, title, description, image, voice_options, min_time_in_minutes) VALUES
(4, 'Csapatban az igazi', 'Műhelymunkák, megbeszélések, konferenciák és csoportos alkalmak – mindig vannak emberek, akik valamilyen közös ügy érdekében találkoznak. A csapatmunka nem önmagért való cél, hanem a jó és hatásos eredmények garanciája.', 'csapatbanazigazi.jpg', '[]', 5),
(4, 'Tiszta beszéd', 'A jó kommunikáció nélkülözhetetlen része minden megbeszélésnek és egyeztetésnek. Saját gondolatainkat, elképzeléseinket, észrevételeinket, vágyainkat, haragunkat, aggodalmainkat, víziónkat mind megosztjuk másokkal − formálva ez által világunkat.', 'tisztabeszed.jpg', '[]', 5),
(4, 'A lelkek megkülönböztetése', 'Ki vagyok én és mit jelent nekem az élet? Ezeket a kérdéseket életem sok döntésében megválaszolom. Gyakran a döntéseinket nem szabadon, hanem az előítéletek, ellenszenv vagy kényszer hatására hozzuk.', 'megkulonboztetes.jpg', '["Női", "Férfi 1", "Férfi 2"]', 20),
(4, 'Reflektálva tanulni', 'Az Ignáci Pedagógiai Műhely szemináriumainak elhagyhatatlan része a rendszeres reflexiós szünet. A csendben a résztvevők megállnak és ízlelgetik a kapott benyomásokat és ismereteket.', 'reflektalvatanulni.jpg', '["Női", "Férfi 1", "Férfi 2"]', 10),
(4, 'A mindennapok fókusza', 'A mindennapokban nem is olyan egyszerű figyelmünket a fontos és lényeges dolgokon tartani: időpontok, munkahelyi feladatok, magánéleti kötelezettségek, telefonok és emailek versenyeznek a figyelmünkért.', 'mindennapokfokusza.jpg', '["Női", "Férfi 1", "Férfi 2"]', 15);
