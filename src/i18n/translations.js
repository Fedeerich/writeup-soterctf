export const translations = {
  en: {
    practice: "Practice Challenges",
    comp: "PALCAM CG 2026 COMPETITION",
    mastering: "Mastering the",
    cyber_battlefield: "Cyber Battlefield",
    hero_desc: "Explore detailed writeups for the Palcam CG 2026 SoterCTF challenges. Showcasing problem-solving methodologies, reverse engineering, and exploit development.",
    prize: "Top Prize",
    challenges: "Challenges",
    certified: "Certified Completion",
    pts: "pts",
    insights: "Challenge Insights:",
    resolution: "Resolution:",
    flag: "Captured Flag:",
    payload: "Exploit / Payload:",
    copy: "Copy",
    copied: "Copied!",
    built_for: "Built for the",
    ctf_comp: "SoterCTF writeup competition",
    survey: "Competition Survey",
    view_chal: "View Challenges",
    rights: "© 2026 Carriedo. All rights reserved.",
    featured: "Featured Writeups",
    loading: "Loading components...",
    task: "Task",
    challengeData: [
      {
        id: 1, category: "Cryptography",
        name: "Caïssa",
        description: "During the Nebula-12 mission, a secret transmission with vital mission data was sent to Earth. However, the encoding mechanism of the lunar module's communication system has been lost to time. Your task is to decode the intercepted signal and recover the hidden message. The transmission uses a custom numerical encoding scheme with a mysterious modular value. Unveil the secrets of the past and plant your flag on the Moon!",
        resolution: `Analysis and Reconnaissance
Upon inspecting the output, it becomes obvious that we are looking at hexadecimal deltas rather than direct data. This suggests a multi-layered encoding pipeline: Golomb-like compression, 5-bit packing, and Delta encoding.

Exploitation Phase

Step 1 — Reverse Delta Encoding
The first step is to reverse the difference array using a cumulative sum to reconstruct the original integer stream.

Step 2 — Rebuild the Bitstream
Knowing each integer corresponds to a 5-bit chunk, we unpack the values to restore the original compressed bitstream.

Step 3 — Modulus Brute-forcing (Golomb Decoding)
Recognizing the Golomb-like structure, we need to find the unknown modulus 'm'. By brute-forcing the valid parameter space (multiples of 4 between 100 and 200), we hit the correct modulus (m=104), producing readable ASCII.

Lessons Learned
Multi-stage encodings often obscure a fundamentally simple mathematical scheme. Realizing the data was delta-encoded was the crucial first step to bit-level recovery.`
      },
      {
        id: 2, category: "Misc",
        name: "Bank",
        description: "A group of hackers has gained access to the internal server of PalCam Bank, the most exclusive financial entity in the country. However, the next-generation authentication system blocks the path to any intruder.\nRumor has it that somewhere on that server there is an account with privileged access. To reach it, you will have to overcome three layers of security designed by the bank's best engineering team.\nAre you able to bypass the system and prove that no vault is impregnable?",
        resolution: `Analysis and Reconnaissance
Reviewing the source code or behavior reveals a critical vulnerability: the authentication script relies on Python 2's native 'input()' function to collect the user's PIN and Token.

Exploitation Phase

Step 1 — Understanding the 'input()' flaw
In Python 2, 'input()' evaluates the typed text as live code (acting equivalently to 'eval()'). This allows us to inject commands and directly access runtime memory variables.

Step 2 — PIN Bypass
The PIN is validated dynamically against the 'users' memory dictionary. Instead of guessing a heavily randomized PIN, when prompted, we simply type the local variable syntax 'users[username]'. Since it is evaluated natively, it automatically resolves to the exact correct PIN, granting us the first layer of access.

Step 3 — Dynamic Token Bypass
The system securely evaluates a token based on timestamp bounds, PID, and a SHA1 hash stored securely in the 'real_token' variable. Upon passing the PIN, when prompted for the Token, we simply submit 'real_token'. The system harmlessly equates the underlying variable with itself.

Lessons Learned
Never use 'input()' in Python 2 for untrusted user input; 'raw_input()' should be rigidly verified instead. Secure implementations must strictly sandbox internal variables from any evaluation scopes.`
      },
      {
        id: 3, category: "Web",
        name: "Cosmos Strike",
        description: "Orbital Strike is an in-browser 3D shooter set on the Moon. Register as a pilot and fight waves of enemies.\n\nThere is a secret in /bossboard.php",
        resolution: `Analysis and Reconnaissance
Exploring the application leads us to the hint regarding '/bossboard.php'. It is highly likely that while we don't have direct access, an admin bot periodically reviews this scoreboard. This indicates a classic **Blind Cross-Site Scripting (XSS)** attack vector.

Exploitation Phase

Step 1 — XSS Payload Injection
Since we can register as pilots, the vulnerability lies in the lack of sanitization on the username field. During registration, instead of a normal alias, we inject a JavaScript payload designed to force the viewer to exfiltrate data to our controlled server (e.g., using Webhook.site).

Step 2 — Executing Exfiltration
We play the game to ensure our score ends up on '/bossboard.php'. When the admin bot accesses the page to review the boss board, our injected script executes in its local browser (indicated by the 'http://127.0.0.1:8000' referer), capturing the secret flag and dispatching it in a GET request.

Step 3 — Reception and Decoding
Checking our Webhook.site dashboard, we observe the incoming GET request. The injected 'flag=' variable contains a Base64-encoded string. Decoding it reveals the captured flag in plain text.

Lessons Learned
Stored Blind XSS attacks are lethal, especially targeting administration panels. Any user input that ends up reflected on an internal administrative screen must be strictly sanitized before rendering into HTML.`
      },
      {
        id: 4, category: "Cryptography",
        name: "Random Lunar Primes",
        description: "On the lunar surface, a spacecraft detects a mysterious signal. Systems begin to fail, displaying sequences of seemingly random numbers. The crew discovers that they are prime numbers, chaotically intertwined, forming part of a hidden enigma. Time is running out as the ship's resources dwindle. Can you crack the code and uncover the message before it's too late? The fate of the mission is in your hands.",
        resolution: `Analysis and Reconnaissance
Upon inspecting the encryption scheme's source code, we realize the "prime numbers" are simply a red herring to create noise generation. The true encoding relies on small deterministic keys and modular arithmetic: 'C[i] = ord(flag[i]) + key[i] ^ key[-i]'.

Exploitation Phase

Step 1 — Recovering the First Key Segment
We observe that the allowed generation bounds for 'key' strings are strictly contained in [0, 23]. Due to this drastically small key space, we can brute-force the 'key[0]' value by checking which index produces valid printable ASCII bounds (32-126).

Step 2 — Reconstructing the Full Key
After cracking the index constraint for the initial key step, observing the revealed deterministic formula ('[k0 + i] % 24'), we mathematically recreate the entire key array.

Step 3 — Decrypting the Flag
Rearranging the mathematical schema to 'flag[i] = C[i] - (key[i] ** key[-i])', we loop across the decoded blocks reversing the exponentiation factor across the fully reconstructed key string, thus extracting the flag.

Lessons Learned
Extremely confined modular key ranges are practically begging for brute-force executions. Exponentiation-based encryption models are weak when lacking grand constraints.`
      },
      {
        id: 5, category: "OSINT",
        name: "Concrete Frequency",
        description: "We intercepted this photograph from an informant. We know it's in Barcelona, but we need to triangulate its exact position, where it's looking, and understand the environment where it hides. Solve the following points.",
        resolution: `Analysis and Reconnaissance
This OSINT challenge relies heavily on geographic triangulation merged with historical archive research. We began by executing reverse image searches and cross-referencing the mountainous skyline surrounding the city of Barcelona.

Exploitation Phase

Task 1 — Distant Skyline Identification
Observing the distinct silhouette resting in the far background, we can accurately match the towering telecommunications needle to Barcelona's renowned **Torre de Collserola**, yielding our first flag.

Task 2 — Exact Hill Topography
The immediate location where the subject is pictured is widely nicknamed by tourists as the "Bunkers of Carmel". However, the challenge explicitly demands the local cartographic naming. A precise review of the civic map registries reveals the hill's true geographic designation: **Turó de la Rovira**.

Task 3 — Historical Military Context
Knowing that this specific hill served as a republican anti-aircraft defense battery during the Spanish Civil War to repel fascist aerial bombings, we reviewed historical military architectures. Archival blueprints confirm the initial installment of four massive cannons manufactured specifically as **Vickers 105 mm** anti-aircraft guns.

Lessons Learned
Tourist nicknames differ drastically from official geographic topography; an OSINT practitioner must always seek verified mapping registries. Furthermore, combining modern spatial recognition with historical military documentation is the fastest path to chaining multiple intel-based flags.`
      },
      {
        id: 6, category: "OSINT",
        name: "Blue Crystal Crumbs",
        description: "Agent, the DEA has detected the reappearance of a high-purity product on the streets. Our informants indicate that the lead cook operates under the alias Heisenberg_Kross69.\nYour mission is to trace their digital footprint, find their private communication channel, identify the company supplying their chemical precursors, and locate the exact drop-off point.\nThe clock is ticking, agent.",
        resolution: `Analysis and Reconnaissance
We launched our investigation targeting the alias 'Heisenberg_Kross69'. Scouring across the suggested platforms, we successfully tracked down the target's active public profile on Mastodon.

Exploitation Phase

Task 1 — Operational Security (OpSec) Failure
By inspecting the timeline of his Mastodon profile, we noticed that his very first post displayed an "edited" tag. Viewing the edit history of this message revealed that he initially leaked his direct email address before quickly attempting to redact it.

Task 2 — Document Metadata Extraction
The target shared technical PDFs detailing industrial-grade filtration systems. By downloading these documents and running them through a metadata analyzer (such as ExifTool), we uncovered hidden corporate information embedded within the "Creator / Organization" tag, identifying the supplier as **Madrigal Electromotive**.

Task 3 — IMINT and Geolocation
Using the visual evidence of his next meetup uploaded to his feed, we observed a neon-lit scenario around 'Central Ave'. Executing a visual cross-reference via Google Street View mapping, we successfully triangulated the exact commercial establishment: Albuquerque's classic **Dog House Drive-In**.`
      },
      {
        id: 7, category: "Web",
        name: "Galactic Breach",
        description: "SoterCTF servers have been hacked by an interstellar group of cybercriminals trying to steal classified information from the Galactic Dominion MMO. Your mission is to recover the data before it falls into the wrong hands.",
        resolution: `Analysis and Reconnaissance
The challenge presents a search form for planets and galaxies. By injecting special characters into the 'Data type' field, we observed a PHP error message revealing the use of the \`SimpleXMLElement::xpath()\` function. This confirms an **XPath Injection** vulnerability.

Exploitation Phase

Step 1 — Probing the Logic
The application uses the input to filter nodes in an XML database. We tested the injection using the \`|\` (OR) operator to see if we could append our own queries. Entering \`minerals | //*\` confirmed we could select all nodes in the document.

Step 2 — Targeting the Flag
Knowing the flag format, we crafted a payload to search for any node containing the 'SoterCTF' string:
\`minerals | //*[contains(text(), 'SoterCTF')]\`

Step 3 — Flag Extraction
The server processed the query and rendered the hidden flag node directly in the results box, revealing the captured flag.

Lessons Learned
Input used in XPath queries must be strictly sanitized or validated against a whitelist. Direct concatenation of user input into XML query strings allows for full document traversal and data exfiltration.`
      },
      {
        id: 8, category: "Cryptography",
        name: "Random Moon Base",
        description: "During a reconnaissance mission in a dark crater, a spacecraft detects an ancient structure under the lunar dust. As it approaches, the structure emits a series of light patterns that seem to follow a specific order. The explorers attempt to interpret the patterns, but each attempt only reveals fragments of a message críptico.",
        resolution: `Analysis and Reconnaissance
The challenge involves a sophisticated multi-stage encoding pipeline. We deduced that the flag was first converted to a large integer, then represented in an unknown base (between 10 and 60), and finally mapped through a shuffled alphabet.

Exploitation Phase

Step 1 — Identifying the Weakness
The critical vulnerability lies in the deterministic nature of the alphabet shuffle. The script uses \`random.seed(base * 64)\` (or similar logic) to shuffle the standard alphabet. Since the range of potential bases is small (10 to 60), the entire key space can be brute-forced.

Step 2 — Brute-Force Strategy
We developed a Python solver that iterates through every possible base. For each iteration, it:
1. Re-seeds the RNG to reconstruct the specific shuffled alphabet for that base.
2. Reverses the character mapping to recover base-N digits.
3. Converts the base-N digits back into a large integer and finally into ASCII bytes.

Step 3 — Extraction
In our analysis, checking the base space automatically recovered the valid flag format: **SoterCTF{53ee28c5...}**.

Lessons Learned
Combining multiple weak encoding layers (base conversion + substitution) does not equal strong cryptography. Using predictable seeds for "random" permutations makes the system trivial to reverse-engineer given a small brute-force range.`
      },
      {
        id: 9, category: "OSINT",
        name: "Whispers of the Old Castle",
        description: "An anonymous user uploaded an aerial photograph of a historic estate somewhere in Europe to a public platform. No EXIF metadata is available. Your mission consists of identifying key information related to the place, its history, and the person who published the image.",
        resolution: `Analysis and Reconnaissance
The challenge requires a multi-layered OSINT investigation, progressing from geographic identification to historical research and finally digital forensics within mapping metadata.

Exploitation Phase

Step 1 — Geographic Narrowing
By analyzing the architecture and the surrounding landscape in the aerial photograph, we narrowed the location to Mediterranean Europe. Distinctive elements eventually pointed to Spain as the host country.

Step 2 — Landmark Identification
Using reverse image search and cross-referencing structural layouts (towers, estate geometry), we identified the historical site as the **Castillo de Sant Marçal**.

Step 3 — Historical Provenance
Researching the estate's lineage shows it was originally acquired by the Marimón family in 1225. Continuing the genealogical thread to the present day confirms that the property currently belongs to the **Trénor family**.

Step 4 — Attribution Forensics (IMINT)
The final task required finding the specific contributor of the aerial imagery. By navigating to the exact coordinates in satellite view and inspecting the panoramic/3D metadata layers, we identified the user **matauira_chin_ah_you** as the author of the capture.

Lessons Learned
OSINT is a game of progressive elimination. A single image can reveal geographic data, which pivots to historical records, which finally enables the discovery of digital attribution through mapping platforms.`
      },
      {
        id: 10, category: "Misc",
        name: "Strange Message",
        description: "I stumbled upon some very strange audio files on a USB drive... They sound distorted, unsettling, almost as if they are hiding a secret. Find out what it is.",
        resolution: `Analysis and Reconnaissance
The challenge provides an audio file characterized by structured, periodic noise rather than random distortion. This acoustic profile is typical of **Slow Scan Television (SSTV)**, a protocol used to transmit images over narrow-bandwidth radio channels.

Exploitation Phase

Step 1 — Signal Identification
Using a waveform analyzer like Audacity, we inspected the signal's frequency and pulse duration. The periodic tone bursts confirmed an SSTV encoding format, which is often used as a steganography layer in CTF challenges.

Step 2 — Audio Decoding
We processed the audio through an SSTV decoder (such as RX-SSTV or QSSTV). By enabling auto-detection for the transmission mode, the software began reconstructing an image from the audio stream in real-time.

Step 3 — Extraction
The resulting image, once fully rendered, contained the clear text of the flag: **SoterCTF{h3ll0_fRo0oM_th3_m00n!}**.

Lessons Learned
Audio signals are excellent carriers for visual information. In mixed-category challenges, structured noise often hides data in the frequency domain, requiring specialized decoders or spectral analysis to uncover the payload.`
      },
      {
        id: 11, category: "Programming",
        name: "Asteroid Pathfinder",
        description: "In this challenge, you are provided with a large ASCII grid representing an asteroid field. Your task is to implement a pathfinding algorithm (e.g. A*) to find the shortest route from start to finish, moving only horizontally or vertically.",
        resolution: `Analysis and Reconnaissance
The challenge provides a large ASCII grid where \`.\` represents traversable space and \`#\` denotes obstacles. Given the complexity and scale of the navigate, manual resolution is unfeasible. We need to implement a shortest-path algorithm that operates on a 2D coordinate system with restricted movement (horizontal and vertical).

Exploitation Phase

Step 1 — Parsing the Data
The input is provided as a Python dictionary containing the grid (a list of strings) and the start/end coordinates. We first parsed this into a navigable data structure, mapping each cell (x, y) to its corresponding value.

Step 2 — Selecting the Algorithm
For finding the shortest path in an unweighted grid, the **Breadth-First Search (BFS)** algorithm is optimal as it guarantees the shortest path in terms of steps. Alternatively, **A* Search** with a Manhattan distance heuristic can be used to optimize the search speed in larger maps.

Step 3 — Implementation and Execution
We implemented a queue-based BFS that tracks visited nodes to prevent cycles and stores the cumulative distance from the start point. Upon reaching the target coordinates, the algorithm returns the total count of steps taken.

Step 4 — Flag Extraction
Running the script on the provided dataset yielded a total distance of **158 steps**, resulting in the code: \`SoterCTF{158}\`.

Lessons Learned
Pathfinding challenges in CTFs are fundamentally about data parsing and algorithm efficiency. Understanding the movement constraints (4-way vs 8-way) is critical to calculating the correct step count.`
      },
      {
        id: 12, category: "Programming",
        name: "A lot of Squares",
        description: "In this challenge, your task is to work with a classic combinatorial object: the Latin square. A Latin square of size n is an n × n grid filled with the numbers from 1 to n, where each number appears exactly once in each row and exactly once in each column. Your job is to generate all possible Latin squares of order 5.",
        resolution: `Analysis and Reconnaissance
The challenge requires the complete enumeration of Latin Squares of order 5 ($n=5$). Because the number of valid squares is large, we need a refined **backtracking search** with row-level pruning to efficiently explore the solution space.

Exploitation Phase

Step 1 — Algorithmic Design
We implemented a recursive search that constructs the square row by row. For each row, we consider all permutations of the set {1, 2, 3, 4, 5}. A candidate row is only accepted if none of its elements conflict with the values already present in the corresponding columns of the previous rows.

Step 2 — Direct Enumeration
By enforcing column uniqueness at each step, the algorithm explores only valid branches, eventually generating the full set of unique Latin squares.

Step 3 — Serialization and Hashing
The final solution requires a specific serialization pipeline:
1. **Flattening**: Each 5x5 square is converted into a 25-character string by joining its rows.
2. **Lexicographical Sorting**: The resulting list of strings is sorted.
3. **Concatenation**: All sorted strings are merged into a single massive string.
4. **Final Hash**: The flag is the MD5 hash of this concatenation.

Step 4 — Flag Extraction
Our optimized script generated exactly 161,280 squares, resulting in the final flag: **SoterCTF{7954879fb82686cebd9ad7c2c3ee8ce0}**.

Lessons Learned
Serialization is as important as generation. In tasks involving hashing over large data sets, the exact order (sorting) and representation format (flattening) are critical to producing the correct checksum.`
      },
      {
        id: 13, category: "Programming",
        name: "A lot of Queens",
        description: "The 8-Queens puzzle is a classic combinatorial problem: place 8 chess queens on an 8x8 board so that no two queens threaten each other. Your task is to find all 92 valid configurations and aggregate them into a single hash.",
        resolution: `Analysis and Reconnaissance
The "8-Queens" puzzle is a classic constraint satisfaction problem that involves placing 8 chess queens on an $8 \times 8$ chessboard so that no two queens threaten each other. This means no two queens can share the same row, column, or diagonal.

Exploitation Phase

Step 1 — Solution Space Reduction
While an $8 \times 8$ board has many combinations, we know each row must contain exactly one queen. We can represent a possible solution as a permutation of the column indices $[0, 1, ..., 7]$. This reduces the search space from $8^8$ to $8! = 40,320$ candidates.

Step 2 — Constraint Validation
We developed a validator to check for diagonal conflicts. For any two queens (x1, y1) and (x2, y2), a conflict occurs if |x1 - x2| == |y1 - y2|. By filtering all 8! permutations through this rule, we identified all 92 distinct solutions.

Step 3 — Serialization and Hashing
The challenge requires a deterministic aggregation of all solutions:
1. **Encoding**: Each solution is converted into an 8-digit string (e.g., "04752613").
2. **Sorting**: All 92 strings are sorted lexicographically.
3. **Concatenation**: All sorted strings are joined into one single string.
4. **Final Hash**: The flag is the MD5 hash of this concatenated string.

Step 4 — Final Extraction
Executing the script yields the required hash: **SoterCTF{5f805477c1a1f2ec689efeb95bfa56ea}**.

Lessons Learned
Classic algorithmic problems like N-Queens often appear in CTF programming categories. Understanding how to model constraints and perform exhaustive search (backtracking or permutation filtering) is essential for these tasks.`
      },
      {
        id: 14, category: "Programming",
        name: "Twins",
        description: "Write a program in your programming language of choice that calculates how many pairs of twin primes exist between 1 and 123,456,789.",
        resolution: `Analysis and Reconnaissance
The challenge requires counting "twin prime" pairs $(p, p+2)$ up to the limit of 123,456,789. While a simple primality check for every odd number might seem intuitive, the massive range (~123 million) makes it computationally prohibitive and memory-intensive for standard sieving methods.

Exploitation Phase

Step 1 — Algorithmic Selection
To process such a large range efficiently, we implemented a **Segmented Sieve of Eratosthenes**. This technique divides the total range into smaller, manageable segments (blocks), drastically reducing the memory footprint while maintaining high execution speed.

Step 2 — Precomputing Base Primes
The first step was to compute all prime numbers up to $\\sqrt{123,456,789} \\approx 11,111$. These base primes are then used to systematically mark off multiples in each subsequent segment of the full range.

Step 3 — Segmented Processing and Counting
We iterated through the range in chunks of $10^6$. For each segment:
1. We marked multiples of the precomputed base primes as non-prime.
2. We identified the remaining unmarked numbers (primes) and tracked the distance to the previous prime.
3. If the difference between two consecutive primes was exactly 2, we incremented the twin prime counter.

Step 4 — Final Extraction
By maintaining the state of the last prime identified across segment boundaries, we ensured an accurate count of exactly **530,477** twin prime pairs.

Lessons Learned
Memory optimization is as critical as execution speed in large-scale numerical challenges. Segmented algorithms allow for processing datasets that exceed available RAM by focusing on local spatial complexity.`
      },
      {
        id: 15, category: "Reverse Engineering",
        name: "Access denied",
        description: "Only the elite of the space agency can access this program, can you get the password?",
        resolution: `Analysis and Reconnaissance
The challenge involves a binary that protects its access with a password. Initial reconnaissance through static analysis suggested that the flag might be embedded directly within the program's data sections rather than being obfuscated through complex runtime logic.

Exploitation Phase

Step 1 — Static Memory Inspection
We utilized \`objdump\` to examine the internal sections of the binary. The \`.rodata\` (read-only data) section appeared to contain repetitive 4-byte patterns which indicated structured data rather than random code.

Step 2 — Identifying the Encoding
We observed that the flag was stored as a series of 32-bit integers in little-endian format. Each character of the flag was padded with three null bytes (e.g., \`53 00 00 00\` for 'S'). This technique bypasses simple \`strings\` checks as the null bytes break the continuous ASCII sequence.

Step 3 — Extraction and Reconstruction
By dumping the hex values from \`.rodata\` and converting the 32-bit values back into their corresponding ASCII characters, we reconstructed the full sequence.

Step 4 — Final Extraction
The decoded sequence revealed the flag: **SoterCTF{fc0a143ff035763e07bf123813915733}**.

Lessons Learned
"Access Control" challenges in Reverse Engineering don't always require deep disassembly. Always start with a thorough inspection of data sections like \`.rodata\`. Identifying integer-encoded strings is a fundamental skill for bypassing simple security obfuscation.`
      },
      {
        id: 16, category: "Forensics",
        name: "Pentest Report",
        description: "Hi team, As requested, we're resending the vulnerability assessment report. We've cropped the screenshot to ensure that no extracted database information is visible.",
        resolution: `Analysis and Reconnaissance
The challenge provides a Google Doc link to a "Pentest Report". The description explicitly mentions that a screenshot within the document has been "cropped" to hide sensitive information. In digital forensics, cropping an image in a cloud editor often merely changes the visual viewport (clip) without deleting the original image data.

Exploitation Phase

Step 1 — Investigating Rendering Modes
Standard web editors use JavaScript to manage dynamic clipping and UI restrictions. By accessing the document through alternative rendering endpoints, such as the Google Docs mobile view (appending \`/mobilebasic\` to the URL), we can bypass these presentation layers.

Step 2 — Bypassing UI Restrictions
The \`/mobilebasic\` view serves a stripped-down, static version of the document. This version often renders embedded objects in their raw or unclipped state because it lacks the complex layout engine required to maintain the "crop" mask applied in the desktop editor.

Step 3 — Content Recovery
Alternatively, by disabling JavaScript in the browser settings and reloading the document, the viewer is forced to render a simplified HTML version. In this mode, the "cropped" image container fails to enforce its clipping boundaries, revealing the full, uncropped version of the original capture.

Step 4 — Final Extraction
Inside the recovered image content, the hidden flag was clearly visible: **SoterCTF{ad3f2da471766134a2430af75ecd0e15}**.

Lessons Learned
"Security through obscurity" via UI-level cropping is a common pitfall. Modern document fragments often retain original assets in their entirety for non-destructive editing. Forensic investigators should always look for "Basic HTML" or "Mobile" views to inspect raw content delivery.`
      },
      {
        id: 17, category: "OSINT",
        name: "Deep Fried Discovery",
        description: "Someone has tried to obscure the beauty of this architectural gem by trapping the image in a digital vortex. Your mission is to identify this imposing hospital complex and discover the mastermind behind its design.",
        resolution: `Analysis and Reconnaissance
The challenge presents a "deep fried" image—a term for images that have been heavily distorted through extreme saturation, contrast, and noise filters. Despite this visual chaos, architectural structures often retain distinct silhouettes and stylistic "fingerprints".

Exploitation Phase

Step 1 — Visual Pattern Recognition
By filtering out the digital noise, we identified key architectural features: red-brick construction, elaborate ceramic ornamentation, and Gothic-inspired arches. These are indicative of **Catalan Modernisme**, a specific movement prevalent in early 20th-century Barcelona.

Step 2 — Geolocation and Identification
We utilized reverse image search (Google Lens) on the distorted image. Despite the filters, the software matched the structural silhouettes and color palettes to the **Hospital de Sant Pau** in Barcelona, a UNESCO World Heritage site known for its pavilions and unique layout.

Step 3 — Attribution Research
Historical records for the Hospital de la Santa Creu i Sant Pau confirm that the complex was designed by the renowned architect **Lluís Domènech i Montaner**, whose style is unmistakable.

Step 4 — Final Extraction
The flag is the full name of the architect: **SoterCTF{Lluís_Domènech_i_Montaner}**.

Lessons Learned
OSINT challenges involving image distortion test pattern recognition over raw data extraction. Identifying a specific artistic or architectural style allows for rapid narrowing of geographic search spaces, even when traditional metadata is stripped.`
      },
      {
        id: 18, category: "Misc",
        name: "Sanity check",
        description: "Join the SoterCTF Discord server and find the flag hidden among the channels."
      },
      {
        id: 19, category: "Binary Exploitation",
        name: "The Space Man",
        description: "The ship has entered a critical state. During the journey, an automatic system failure activated the emergency protocol: total hibernation. All doors have been sealed. The central command reports the existence of two access cards needed to regain control... but the security system has hardened its defenses. Nothing responds. Everything is locked. Find the cards. Open the doors. Survive. And come home, comrade.",
        resolution: `Exploitation / Analysis

Step 1 — Load Assembly
- Opened Assembly-CSharp.dll in ILSpy
- Navigated through classes
- Found interesting class: final

Step 2 — Identify Flag Logic

Relevant code:
private string flagEncriptada = "U290ZXJDVEZ7RDNmZW41RV9zMVNUM21fZEk1NWFCbGVkfQ==";

And decoding function:
byte[] bytes = Convert.FromBase64String(flagEncriptada);
return Encoding.UTF8.GetString(bytes);

👉 Flag is simply Base64 encoded

Step 3 — Decode Base64 with Python
(Check the Payload sector for the python script solution)`
      }
    ]
  },
  es: {
    practice: "Retos de Práctica",
    comp: "COMPETICIÓN PALCAM CG 2026",
    mastering: "Dominando el",
    cyber_battlefield: "Campo de Batalla Cibernético",
    hero_desc: "Explora writeups detallados de los retos del SoterCTF Palcam CG 2026. Mostrando metodologías de resolución de problemas, ingeniería inversa y desarrollo de exploits.",
    prize: "Premio Mayor",
    challenges: "Retos",
    certified: "Completitud Certificada",
    pts: "pts",
    insights: "Detalles del Reto:",
    resolution: "Resolución:",
    flag: "Bandera Capturada:",
    payload: "Exploit / Payload:",
    copy: "Copiar",
    copied: "¡Copiado!",
    built_for: "Creado para la",
    ctf_comp: "competición de writeups de SoterCTF",
    survey: "Encuesta de Competición",
    view_chal: "Ver Retos",
    rights: "© 2026 Carriedo. Todos los derechos reservados.",
    featured: "Writeups Destacados",
    loading: "Cargando componentes...",
    task: "Tarea",
    challengeData: [
      { id: 1, name: "Caïssa", category: "Criptografía", description: "Durante la misión Nebula-12, se envió una transmisión secreta a la Tierra con datos vitales de la misión. Sin embargo, el mecanismo de codificación del sistema de comunicaciones del módulo lunar se ha perdido con el paso del tiempo. Tu tarea consiste en descodificar la señal interceptada y recuperar el mensaje oculto. La transmisión utiliza un esquema de codificación numérica personalizado con un misterioso valor modular. ¡Desvela los secretos del pasado y planta tu bandera en la Luna!",
        resolution: `Análisis y Reconocimiento
Al inspeccionar el output, nos damos cuenta de que no son datos directos, sino diferencias codificadas en hexadecimal. Esto sugiere que existen varias capas de codificación: compresión (tipo Golomb), bit-packing en bloques de 5 bits y codificación Delta.

Fase de Explotación

Paso 1 — Invertir la codificación Delta
El primer paso es revertir el array de diferencias usando una suma acumulativa para reconstruir el flujo de enteros original.

Paso 2 — Reconstruir el Bitstream
Como cada valor representa un fragmento de 5 bits, desempaquetamos los valores recuperando el flujo original de unos y ceros mediante operaciones bit a bit.

Paso 3 — Fuerza Bruta del Módulo (Golomb Decoding)
Sabiendo que el algoritmo emplea una codificación tipo Golomb con un módulo 'm' desconocido, iteramos sobre el espacio posible (entre 100 y 200, en múltiplos de 4). El módulo correcto (m=104) revela instantáneamente la bandera en texto claro.

Lecciones Aprendidas
Una codificación en múltiples etapas a menudo oculta debajo un modelo matemático sencillo. Identificar la codificación Delta inicial fue crítico para poder restaurar los datos a nivel de bit.`
      },
      { id: 2, name: "Bank", category: "MISC", description: "Un grupo de hackers ha conseguido acceso al servidor interno de PalCam Bank, la entidad financiera más exclusiva del país. Sin embargo, el sistema de autenticación de nueva generación bloquea el paso a cualquier intruso.\nSe rumorea que en algún lugar de ese servidor existe una cuenta con acceso privilegiado. Para llegar a ella, tendrás que superar tres capas de seguridad diseñadas por el mejor equipo de ingeniería del banco.\n¿Eres capaz de burlar el sistema y demostrar que ninguna bóveda es inexpugnable?",
        resolution: `Análisis y Reconocimiento
Al revisar el código y la forma en la que la conexión nos pide las credenciales, descubrimos una vulnerabilidad crítica: el script de autenticación está utilizando la función nativa 'input()' de Python 2 para recoger el PIN y el Token del usuario.

Fase de Explotación

Paso 1 — Comprender el fallo de 'input()'
En Python 2, la función 'input()' evalúa el texto introducido como si fuese código fuente (equivalente a 'eval()'). Esto permite inyectar y acceder a variables dinámicas directamente desde la memoria en ejecución.

Paso 2 — Bypass del PIN
El PIN se valida en el backend contra el diccionario en memoria 'users'. En vez de adivinar el PIN aleatorio generado, cuando el sistema nos pide el PIN introducimos literalmente la sintaxis de variable 'users[username]'. Al evaluarse, ¡esto lee dinámicamente el PIN logrando coincidir e inyectando un acceso positivo!

Paso 3 — Bypass del Token Dinámico
La última capa de seguridad emplea un token dinámico basado en tiempo, PID y un hash SHA1, pero el valor esperado completo se guarda temporalmente en la variable 'real_token'. En el momento en que se solicita el Token, simplemente escribimos 'real_token'. El sistema evalúa nuestra entrada copiando la referencia alojada.

Lecciones Aprendidas
Nunca se debe usar 'input()' en Python 2 para recoger entradas no confiables de un socket; siempre debe usarse 'raw_input()'. La autenticación en memoria jamás debe exponer el alcance de sus variables internas a un proceso capaz de interactuar localmente.`
      },
      { id: 3, name: "Cosmos Strike", category: "Web", description: "Orbital Strike es un shooter 3D en el navegador ambientado en la Luna. Regístrate como piloto y combate oleadas de enemigos.\n\nHay un secreto en /bossboard.php",
        resolution: `Análisis y Reconocimiento
Al explorar la aplicación, notamos la pista que apunta a '/bossboard.php'. Sin embargo, es altamente probable que no tengamos acceso directo a los datos internos, pero sí un bot administrador que revise constantemente esa tabla de puntuaciones. Esto es un escenario clásico para un ataque de **Cross-Site Scripting (XSS) Ciego**.

Fase de Explotación

Paso 1 — Inyección del Payload XSS
Dado que podemos registrarnos como pilotos en el juego, la vulnerabilidad reside en la falta de sanitización del nombre de usuario. Al registrarnos, en lugar de un alias normal, inyectamos un payload de JavaScript que fuerce al visitante a exfiltrar información hacia nuestro servidor controlado (por ejemplo, usando Webhook.site).

Paso 2 — Exfiltración Ejecutada
Jugamos para garantizar que nuestra puntuación aparezca en '/bossboard.php'. Cuando el bot administrador accede a la página para revisar el tablero de jefes, nuestro script inyectado se ejecuta en su navegador local (reflejado en el referer 'http://127.0.0.1:8000'), capturando la flag secreta y enviándola en la solicitud GET.

Paso 3 — Recepción y Decodificación
Al revisar nuestro panel de Webhook.site, observamos la llegada de la solicitud GET. La variable inyectada 'flag=' extrae una cadena en Base64. Al decodificarla, obtenemos en texto claro la bandera capturada.

Lecciones Aprendidas
Los ataques de XSS almacenado ciego (Blind XSS) son letales en paneles de administración. Cualquier entrada que acabe reflejada en una pantalla administrativa debe ser sanitizada estrictamente antes de renderizarse en el HTML.`
      },
      { id: 4, name: "Random Lunar Primes", category: "Criptografía", description: "En la superficie lunar, una nave espacial detecta una señal misteriosa. Los sistemas comienzan a fallar, mostrando secuencias de números aparentemente aleatorios. La tripulación descubre que se trata de números primos, entrelazados caóticamente, que forman parte de un enigma oculto. El tiempo se agota a medida que los recursos de la nave disminuyen. ¿Podrás descifrar el código y descubrir el mensaje antes de que sea demasiado tarde? El destino de la misión está en tus manos.",
        resolution: `Análisis y Reconocimiento
Al inspeccionar el código fuente del esquema de cifrado, descubrimos que los "números primos" en realidad actúan como un simple señuelo para la generación de ruido, no forman parte de la resolución matemática. La codificación real se basa en una clave determinística pequeña y aritmética modular: 'C[i] = ord(flag[i]) + key[i] ^ key[-i]'.

Fase de Explotación

Paso 1 — Recuperar el primer segmento de la clave
Notamos que los valores generados para 'key' siempre se mantienen en el rango de [0, 23]. Dado este espacio tan pequeño, podemos iterar con fuerza bruta el valor de 'key[0]' esperando encontrar la constante que produce caracteres en rango ASCII válidos (32-126). 

Paso 2 — Reconstruir la Clave Completa
Una vez deducido el segmento cero, dada la linealidad determinística revelada en la función de generación ('[k0 + i] % 24'), reconstruimos el array de la clave al completo.

Paso 3 — Desencriptar la Flag
Deconstruyendo la fórmula matemática inicial 'flag[i] = C[i] - (key[i] ** key[-i])', iteramos sobre la matriz final restando la suma exponencial de nuestras claves resueltas, logrando iterativamente la conversión a los caracteres originales de la bandera.

Lecciones Aprendidas
Los espacios de clave modulares tan reducidos invitan instantáneamente a los ataques de fuerza bruta. La encriptación basada en exponenciación, cuando no tiene límites gigantescos, resulta vulnerable si la clave se ve expuesta.`
      },
      { id: 5, name: "Concrete Frequency", category: "OSINT", description: "Hemos interceptado esta fotografía de un informante. Sabemos que está en Barcelona, pero necesitamos triangular su posición exacta, hacia dónde mira y entender el entorno donde se esconde. Resuelve los siguientes puntos.",
        resolution: `Análisis y Reconocimiento
Este reto de búsqueda en fuentes abiertas (OSINT) requería aplicar técnicas de triangulación geográfica combinadas con investigación de archivos históricos. Empezamos utilizando herramientas de búsqueda inversa de imágenes y reconociendo el horizonte montañoso de la ciudad de Barcelona.

Fase de Explotación

Tarea 1 — Identificación del Horizonte
Al observar el inconfundible 'skyline' que recorta la imagen al fondo, reconocemos inmediatamente la gigantesca aguja de comunicación: la **Torre de Collserola**. Esto nos da la primera 'flag'.

Tarea 2 — Mapeo de la Colina
El punto exacto desde donde el sujeto de la camiseta está sentado nos indica popularmente el mirador de los "Bunkers del Carmel". Sin embargo, el reto nos exige el nombre oficial cartográfico de esa colina específica. Tras consultar registros oficiales locales, el término geográfico exacto resulta ser el **Turó de la Rovira**.

Tarea 3 — Contexto Histórico Militar
Sabiendo que esta localización se usó como batería de defensa antiaérea durante la Guerra Civil Española, revisamos planimetrías y registros militares. Los archivos constatan que la colina albergaba originalmente 4 cañones de grueso calibre cuyo fabricante y modelo concreto coinciden con el cañón **Vickers 105 mm**.

Lecciones Aprendidas
Los retos de OSINT frecuentemente incluyen nombres populares o turísticos que pueden ser señuelos; siempre hay que verificar los topónimos geográficos oficiales. Cruzar simples análisis del paisaje con búsquedas históricas estructuradas desvela banderas secundarias en cadenas de investigación.`
      },
      { id: 6, name: "Blue Crystal Crumbs", category: "OSINT", description: "Agente, la DEA ha detectado la reaparición de un producto de alta pureza en las calles. Nuestros informantes indican que el cocinero principal opera bajo el alias Heisenberg_Kross69.\nSabemos que es brillante, pero su arrogancia le ha llevado a presumir de su 'arte' en la red bajo ese mismo seudónimo. Tenemos constancia de su existencia, pero necesitamos pruebas sólidas para la redada.\nTu misión es rastrear su huella digital, encontrar su canal de comunicación privado, identificar a la empresa proveedora de sus precursores químicos y localizar el punto exacto de su próxima entrega.\nNuestra división de ciberinteligencia ha acotado su área de actividad. Te sugerimos empezar a peinar plataformas como Mastodon, X, GitHub, Reddit o Whisper. Busca su alias. Encuentra su rastro.\nEl reloj está corriendo, agente.",
        resolution: `Análisis y Reconocimiento
Iniciamos la búsqueda focalizándonos en el alias 'Heisenberg_Kross69' sugerido en el briefing. Tras buscar en las distintas plataformas, encontramos un perfil público activo en Mastodon.

Fase de Explotación

Tarea 1 — Seguridad Operacional (OpSec)
Al inspeccionar el 'timeline' de su perfil en Mastodon, notamos que su primera publicación tiene el historial de edición disponible. Al ver las versiones anteriores del mensaje ("modificación del mensaje"), encontramos que originalmente había expuesto su correo electrónico real antes de intentar censurarlo.

Tarea 2 — Análisis de Metadatos de Documentos
El objetivo compartió enlaces a documentos técnicos sobre sistemas de filtrado de grado industrial en su red. Al descargar estos PDFs y pasarlos por un analizador de metadatos (como ExifTool), descubrimos información oculta en el campo "Creador / Organización", que revela al proveedor corporativo: **Madrigal Electromotive**.

Tarea 3 — Inteligencia Visual (IMINT) y Geolocalización
En la pista visual subida a su cuenta, se muestra un encuentro nocturno en 'Central Ave'. Utilizando Google Maps y contrastando elementos clave de la imagen (como las luces de neon o la estructura), mapeamos el barrio a través de Street View hasta identificar el emblemático local de perritos calientes de Albuquerque: el **Dog House Drive-In**.`
      },
      { id: 7, name: "Galactic Breach", category: "Web", description: "Los servidores de SoterCTF han sido pirateados por un grupo interestelar de ciberdelincuentes que intentan robar información clasificada sobre los planetas y recursos del MMO Galactic Dominion. Tu misión es recuperar los datos antes de que caigan en manos equivocadas.",
        resolution: `Análisis y Reconocimiento
El reto presenta un formulario de búsqueda intergaláctica. Al inyectar caracteres especiales en el campo 'Data type', el servidor devolvió un error de PHP revelando el uso de la función \`SimpleXMLElement::xpath()\`. Esto confirma que estamos ante una **Inyección XPath**.

Fase de Explotación

Paso 1 — Confirmación de la Inyección
Probamos el punto de entrada utilizando el operador \`|\` (OR) para concatenar consultas. Al enviar \`minerals | //*\`, el servidor devolvió todos los nodos del documento XML, confirmando el bypass de la lógica original.

Paso 2 — Localización de la Flag
Dado que las banderas siguen un formato conocido, refinamos la consulta para buscar cualquier nodo cuyo texto contenga la cadena 'SoterCTF':
\`minerals | //*[contains(text(), 'SoterCTF')]\`

Paso 3 — Extracción
El servidor ejecutó la consulta modificada y reflejó en pantalla el contenido del nodo oculto que contenía la recompensa.

Lecciones Aprendidas
El procesamiento de XML en el lado del servidor sin sanitización es extremadamente peligroso. Las entradas utilizadas en consultas XPath deben validarse estrictamente contra una lista blanca para evitar que un atacante pueda navegar por toda la estructura del documento.`
      },
      { id: 8, name: "Random Moon Base", category: "Criptografía", description: "Durante una misión de reconocimiento en un cráter oscuro, una nave espacial detecta una antigua estructura bajo el polvo lunar. A medida que se acerca, la estructura emite una serie de patrones luminosos que parecen seguir un orden específico. Los exploradores intentan interpretar los patrones, pero cada intento solo revela fragmentos de un mensaje críptico. A medida que pasan las horas, la estructura comienza a mostrar signos de actividad, como si algo se estuviera preparando para despertar.",
        resolution: `Análisis y Reconocimiento
Este reto presenta una tubería de codificación de múltiples capas bastante ingeniosa. Determinamos que la bandera se convierte primero en un entero binario, luego se transforma a una base numérica desconocida (entre 10 y 60) y, finalmente, cada dígito se mapea mediante un alfabeto desordenado.

Fase de Explotación

Paso 1 — Identificación del Punto Débil
La vulnerabilidad crítica reside en el uso de una semilla determinista para mezclar el alfabeto. El sistema utiliza \`random.seed(base * len(alphabet))\`, lo que significa que el orden de los caracteres es predecible si conocemos la base. Dado que el rango de bases es muy limitado (10-60), el ataque de fuerza bruta es totalmente viable.

Paso 2 — Estrategia de Fuerza Bruta
Creamos un script en Python que itera por cada base posible. En cada paso:
1. Reconstruye el alfabeto barajado específico de esa base.
2. Revierte el mapeo de caracteres para recuperar los dígitos en base-N.
3. Convierte esos dígitos de nuevo a un entero y, finalmente, a texto plano (bytes).

Paso 3 — Extracción
Al alcanzar la base correcta, el script recupera automáticamente la bandera: **SoterCTF{53ee28c5...}**.

Lecciones Aprendidas
La seguridad por oscuridad (mezclar capas de codificación débil) no es criptografía real. El uso de semillas predecibles en generadores de números aleatorios para barajar alfabetos convierte un cifrado de sustitución en algo trivial de revertir mediante computación directa.`
      },
      { id: 9, name: "Whispers of the Old Castle", category: "OSINT", description: "Un usuario anónimo ha subido a una plataforma pública una fotografía aérea de una finca histórica situada en algún lugar de Europa. No hay metadatos EXIF disponibles: la imagen ha sido procesada por el servicio donde fue publicada, eliminando cualquier rastro técnico que pudiera facilitar la investigación.\nAun así, la fotografía contiene suficientes elementos visuales y contextuales como para reconstruir su origen. Tu misión consiste en identificar información clave relacionada con el lugar, su historia y la persona que publicó la imagen.\nTodo lo que necesitas está en la imagen y en tu capacidad de investigación.",
        resolution: `Análisis y Reconocimiento
Este reto plantea una investigación OSINT en cascada: partiendo de la geolocalización visual, pasando por el rastreo histórico de la propiedad y culminando en la atribución digital del autor de la imagen.

Fase de Explotación

Paso 1 — Delimitación Geográfica
Analizando el estilo arquitectónico y el entorno natural de la fotografía aérea, acotamos la búsqueda al sur de Europa. El enclave se confirma rápidamente como territorio español.

Paso 2 — Identificación del Monumento
Mediante búsqueda inversa de imágenes y contraste de los planos de las torres y la geometría de la finca, identificamos el lugar exacto: el **Castillo de Sant Marçal**.

Paso 3 — Investigación de Linaje
Al indagar en la historia del castillo, vemos que fue adquirido por la familia Marimón en 1225. Siguiendo la línea sucesoria hasta la actualidad, determinamos que la propiedad pertenece hoy a la **Familia Trénor**.

Paso 4 — Atribución Digital (IMINT)
La última bandera exigía encontrar al autor de la captura aérea. Navegando por las capas de satélite en las coordenadas precisas e inspeccionando los créditos de las imágenes panorámicas, localizamos al usuario **matauira_chin_ah_you**.

Lecciones Aprendidas
La inteligencia de fuentes abiertas requiere saltar de lo visual a lo documental. Una imagen sin metadatos técnicos aún conserva "huellas digitales" en las plataformas de mapas donde fue publicada originalmente.`
      },
      { id: 10, name: "Strange message", category: "MISC", description: "Me topé con unos archivos de audio muy extraños en una memoria USB... Suenan distorsionados, inquietantes, casi como si ocultaran un secreto. Descubre qué es.",
        resolution: `Análisis y Reconocimiento
El reto proporciona un archivo de audio que contiene un ruido estructurado y periódico en lugar de una distorsión aleatoria. Este perfil acústico es característico de la **Televisión de Barrido Lento (SSTV)**, un protocolo utilizado para transmitir imágenes a través de canales de audio.

Fase de Explotación

Paso 1 — Identificación de la Señal
Utilizando un analizador de forma de onda como Audacity, inspeccionamos la frecuencia y la duración de los pulsos. Los estallidos de tono confirmaron un formato de codificación SSTV, técnica habitual de esteganografía en retos de categoría MISC.

Paso 2 — Descodificación del Audio
Procesamos el audio mediante un descodificador SSTV (como RX-SSTV o QSSTV). Al activar la autodetección del modo de transmisión, el software comenzó a reconstruir una imagen a partir de la señal de audio en tiempo real.

Paso 3 — Extracción
La imagen resultante, una vez renderizada por completo, revelaba el texto de la bandera: **SoterCTF{h3ll0_fRo0oM_th3_m00n!}**.

Lecciones Aprendidas
Las señales de audio son portadoras excelentes para información visual. En retos de señales, el ruido estructurado suele ocultar datos en el dominio de la frecuencia, requiriendo herramientas específicas de radioaficionado o análisis espectral.`
      },
      { id: 11, name: "Asteroid Pathfinder", category: "Programación", description: "En este desafío, se te proporciona una gran cuadrícula ASCII que representa un campo de asteroides, proporcionada como un diccionario Python llamado data con una lista de cadenas (grid) donde . representa el espacio abierto y # representa los obstáculos, junto con las coordenadas de inicio y fin. Tu tarea consiste en implementar un algoritmo de búsqueda de rutas (por ejemplo, A*) para encontrar la ruta más corta desde el inicio hasta el final, moviéndote solo horizontal o verticalmente. El mapa es demasiado grande y complejo para resolverlo manualmente, por lo que tu código debe navegar de manera eficiente por el laberinto. Una vez que hayas encontrado la ruta más corta, envía tu respuesta como una bandera en el formato SoterCTF{n}, donde n es el número de pasos en esa ruta.",
        resolution: `Análisis y Reconocimiento
El reto consiste en navegar por un campo de asteroides representado mediante una cuadrícula ASCII. Disponemos de un diccionario en Python con el mapa (donde \`.\` es espacio libre y \`#\` son obstáculos) y las coordenadas de inicio y fin. Debido a la complejidad del laberinto, la resolución manual es inviable, requiriendo una aproximación algorítmica.

Fase de Explotación

Paso 1 — Procesamiento del Mapa
El primer paso fue transformar la cuadrícula de cadenas en una estructura de datos matricial accesible por coordenadas (x, y). Definimos las reglas de movimiento permitidas: exclusivamente desplazamientos horizontales y verticales.

Paso 2 — Elección del Algoritmo
Para encontrar la ruta más corta en un grafo no pesado (cuadrícula), el algoritmo de **Búsqueda en Anchura (BFS)** es el más adecuado, ya que garantiza la distancia mínima. También se podría emplear **A*** con una heurística de distancia Manhattan para mejorar el rendimiento en mapas de gran escala.

Paso 3 — Ejecución del Script
Desarrollamos un script de Python que utiliza una cola para explorar los nodos nivel a nivel, marcando las celdas visitadas para evitar bucles infinitos. Al alcanzar las coordenadas de destino, el algoritmo devuelve el número total de movimientos realizados.

Paso 4 — Obtención de la Flag
Tras procesar todos los datos del desafío, el algoritmo determinó una ruta óptima de **158 pasos**.

Lecciones Aprendidas
Los retos de programación en CTFs ponen a prueba la eficiencia en la gestión de datos. En problemas de navegación, asegurar que no se visitan nodos repetidos y elegir el algoritmo correcto según las restricciones de movimiento es clave para dar con el resultado exacto.`
      },
      { id: 12, name: "A lot of Squares", category: "Programación", description: "En este desafío, tu tarea consiste en trabajar con un objeto combinatorio clásico: el cuadrado latino. Un cuadrado latino de tamaño n es una cuadrícula n × n rellena con los números del 1 al n, donde cada número aparece exactamente una vez en cada fila y exactamente una vez en cada columna. Tu trabajo consiste en generar todos los cuadrados latinos posibles de orden 5.",
        resolution: `Análisis y Reconocimiento
El objetivo de este reto es la enumeración completa de los Cuadrados Latinos de orden 5 ($n=5$). Un Cuadrado Latino exige que cada cifra del 1 al $n$ aparezca exactamente una vez en cada fila y en cada columna. Aunque el espacio de búsqueda es finito, el crecimiento combinatorio obliga a utilizar una técnica de **backtracking** con poda para evitar una explosión exponencial de cálculos.

Fase de Explotación

Paso 1 — Diseño del Algoritmo
Optamos por un algoritmo de backtracking que construye el cuadrado fila a fila. En cada paso, el script verifica la restricción de unicidad en las columnas. Si una fila candidata rompe la regla en cualquier posición vertical, la rama se descarta inmediatamente, optimizando drásticamente el tiempo de ejecución.

Paso 2 — Lógica de Generación
Utilizamos todas las permutaciones posibles de {1, 2, 3, 4, 5} como candidatas para cada fila. El proceso recursivo garantiza que solo se acepten aquellas configuraciones que mantienen la integridad del Cuadrado Latino global.

Paso 3 — Serialización y Hashing
Para obtener la bandera final, seguimos un protocolo de procesamiento estricto:
1. **Aplanado (Flattening)**: Cada cuadrado se convierte en una cadena de 25 caracteres uniendo sus filas.
2. **Ordenación**: El conjunto total de cadenas se ordena lexicográficamente.
3. **Concatenación**: Se unen todas las cadenas en un único bloque de texto masivo.
4. **Hashing**: Se calcula el Hash MD5 de dicha cadena para generar la solución.

Paso 4 — Obtención de la Flag
Tras generar los 161.280 cuadrados válidos y procesarlos, el script devolvió el código: **SoterCTF{7954879fb82686cebd9ad7c2c3ee8ce0}**.

Lecciones Aprendidas
Los problemas de enumeración combinatoria subrayan la importancia de la serialización determinista. En criptografía y CTFs, el orden de los datos y el formato de representación son tan vitales como el algoritmo de búsqueda para llegar al hash correcto.`
      },
      { id: 13, name: "A lot of Queens", category: "Programación", description: "El problema de las 8 reinas es un rompecabezas clásico: colocar 8 reinas en un tablero de ajedrez de 8x8 de modo que ninguna par de reinas se amenace entre sí. Tu tarea es encontrar todas las soluciones posibles y generar un hash final.",
        resolution: `Análisis y Reconocimiento
El acertijo de las "8 Reinas" es un problema clásico de satisfacción de restricciones que consiste en colocar 8 reinas en un tablero de ajedrez de $8 \times 8$ sin que se amenacen entre sí. Esto implica que no pueden compartir fila, columna ni diagonal.

Fase de Explotación

Paso 1 — Reducción del Espacio de Búsqueda
Sabiendo que cada fila debe contener exactamente una reina, podemos representar cualquier solución válida como una permutación de los índices de las columnas $[0, 1, ..., 7]$. Esto reduce drásticamente las posibilidades de $8^8$ a solo $8! = 40.320$ candidatos.

Paso 2 — Validación de Restricciones
Desarrollamos un validador para comprobar los conflictos en las diagonales. Para dos reinas en las posiciones (x1, y1) y (x2, y2), existe un conflicto si |x1 - x2| == |y1 - y2|. Al filtrar todas las permutaciones bajo esta regla, identificamos las 92 soluciones únicas del problema.

Paso 3 — Serialización y Hashing
El desafío exige agregar todas las soluciones de forma determinista:
1. **Codificación**: Cada solución se convierte en una cadena de 8 dígitos (ej. "04752613").
2. **Ordenación**: Se ordenan las 92 cadenas lexicográficamente.
3. **Concatenación**: Se unen todas las cadenas en un único bloque de texto.
4. **Hash**: La bandera es el MD5 de dicha cadena concatenada.

Paso 4 — Obtención de la Flag
Ejecutando el script de resolución, obtenemos el hash final: **SoterCTF{5f805477c1a1f2ec689efeb95bfa56ea}**.

Lecciones Aprendidas
Los problemas algorítmicos clásicos son recurrentes en los CTFs. Entender cómo modelar restricciones y realizar búsquedas exhaustivas eficientes (ya sea mediante backtracking o filtrado de permutaciones) es fundamental para estos retos de programación.`
      },
      { id: 14, name: "Twins", category: "Programación", description: "Escribe un programa en el lenguaje de programación que prefieras que calcule cuántos pares de primos gemelos existen entre 1 y 123 456 789; es decir, pares de números primos (p, p+2) en los que ambos números son primos.",
        resolution: `Análisis y Reconocimiento
El objetivo es contar los pares de "primos gemelos" $(p, p+2)$ en el rango del 1 al 123.456.789. Dado que el límite es considerablemente alto (aprox. 123 millones), una criba de Eratóstenes estándar consumiría demasiada memoria RAM, y los chequeos de primalidad individuales serían demasiado lentos.

Fase de Explotación

Paso 1 — Elección del Algoritmo
Para manejar este volumen de datos de forma eficiente, optamos por una **Criba Segmentada**. Esta técnica divide el rango total en bloques más pequeños (segmentos), lo que permite procesar grandes intervalos de números utilizando una cantidad mínima de memoria sin sacrificar el rendimiento.

Paso 2 — Precomputación de Primos Base
Calculamos primero todos los números primos hasta la raíz cuadrada del límite ($\\sqrt{123.456.789} \\approx 11.111$). Estos "primos base" son los que utilizaremos para tachar los múltiplos en cada uno de los segmentos posteriores.

Paso 3 — Procesamiento por Bloques y Conteo
Dividimos el rango en segmentos de $10^6$ números. Para cada segmento:
1. Marcamos como "no primos" los múltiplos de nuestros primos base.
2. Identificamos los primos restantes y calculamos la diferencia con el primo inmediatamente anterior.
3. Si la diferencia es exactamente 2, incrementamos el contador de parejas gemelas.

Paso 4 — Obtención de la Flag
Al mantener la referencia del último primo encontrado entre el final de un bloque y el principio del siguiente, nos aseguramos de no perder ninguna pareja en los límites de los segmentos. El resultado final fue de **530.477** pares.

Lecciones Aprendidas
La optimización de la memoria es tan vital como la velocidad de ejecución en retos numéricos a gran escala. Las técnicas de segmentación permiten procesar conjuntos de datos que superan la capacidad de la memoria física mediante la localización de la complejidad espacial.`
      },
      { id: 15, name: "Access denied", category: "Ingeniería inversa", description: "Solo la élite de la agencia espacial puede acceder a este programa, ¿puedes conseguir la contraseña?",
        resolution: `Análisis y Reconocimiento
El reto presenta un binario que solicita una contraseña para autorizar el acceso. Mediante un reconocimiento inicial, determinamos que la bandera podría estar oculta mediante análisis estático, evitando la necesidad de desensamblar lógica compleja de validación en tiempo de ejecución.

Fase de Explotación

Paso 1 — Inspección Estática de Memoria
Utilizamos \`objdump\` para examinar las secciones internas del binario. La sección \`.rodata\` (datos de solo lectura) reveló un patrón repetitivo de 4 bytes que sugería datos estructurados.

Paso 2 — Identificación de la Codificación
Observamos que la bandera estaba almacenada como una secuencia de enteros de 32 bits en formato "little-endian". Cada carácter estaba seguido por tres bytes nulos (ej. \`53 00 00 00\` para la 'S'). Esta técnica de ofuscación es común para evadir el comando \`strings\`.

Paso 3 — Extracción y Reconstrucción
Tras volcar los valores hexadecimales de \`.rodata\`, extrajimos los códigos de carácter y los convertimos de nuevo a sus tipos ASCII correspondientes para reconstruir la bandera completa.

Paso 4 — Obtención de la Flag
La secuencia decodificada reveló la bandera: **SoterCTF{fc0a143ff035763e07bf123813915733}**.

Lecciones Aprendidas
Los retos de "Control de Acceso" en Ingeniería Inversa no siempre requieren un desensamblado profundo. Siempre es recomendable empezar inspeccionando las secciones de datos como \`.rodata\`. Identificar representaciones alternativas (como cadenas codificadas en enteros) es clave para superar capas de seguridad simples.`
      },
      { id: 16, name: "Pentest Report", category: "Forense", description: "Hola, equipo: Tal y como nos solicitaron, les reenviamos el informe de evaluación de vulnerabilidades basado en las pruebas que realizamos el otro día. Hemos recortado la captura de pantalla para garantizar que no se vea ninguna información extraída de la base de datos, de conformidad con sus requisitos de protección de datos.",
        resolution: `Análisis y Reconocimiento
El reto consiste en analizar un informe de pentesting alojado en Google Docs. La descripción señala que una captura de pantalla ha sido "recortada" para proteger datos sensibles. En informática forense, el recorte de imágenes en editores en la nube a menudo solo aplica una máscara visual (clip) sin eliminar los datos originales que permanecen en las capas del documento.

Fase de Explotación

Paso 1 — Exploración de Modos de Renderizado
Los editores web modernos utilizan JavaScript para gestionar las restricciones de la interfaz. Al acceder al documento a través de "endpoints" alternativos, como el modo de visualización básica (añadiendo \`/mobilebasic\` a la URL), es posible saltarse algunas de estas capas de presentación.

Paso 2 — Evasión de Restricciones de UI
La vista \`/mobilebasic\` sirve una versión estática y simplificada del documento. Al carecer del motor de diseño complejo del editor de escritorio, esta vista a menudo renderiza los objetos incrustados en su estado original o sin aplicar las máscaras de recorte, exponiendo lo que teóricamente estaba oculto.

Paso 3 — Recuperación del Contenido
Otra técnica es deshabilitar JavaScript en el navegador y recargar el documento. Esto fuerza a Google Docs a servir una versión en HTML básico donde los contenedores de las imágenes no suelen respetar los límites del recorte, revelando la imagen completa tal y como fue subida originalmente.

Paso 4 — Obtención de la Flag
Al visualizar la imagen sin las restricciones de la interfaz, los datos de la base de datos (antes ocultos) se hicieron visibles, revelando la bandera: **SoterCTF{ad3f2da471766134a2430af75ecd0e15}**.

Lecciones Aprendidas
El "recorte" visual en herramientas de edición colaborativa no suele ser destructivo. Los activos originales suelen conservarse íntegros para permitir ediciones posteriores. Los analistas forenses deben buscar siempre versiones de "HTML Básico" o vistas móviles para inspeccionar la entrega de contenido bruto.`
      },
      { id: 17, name: "Deep Fried Discovery", category: "OSINT", description: "Alguien ha intentado ocultar la belleza de esta joya arquitectónica atrapando la imagen en un vórtice digital. Tu misión es mirar más allá del caos, identificar este imponente recinto hospitalario y descubrir a la mente maestra que lo diseñó.",
        resolution: `Análisis y Reconocimiento
El reto presenta una imagen con un efecto "deep fried", un término utilizado para imágenes fuertemente distorsionadas mediante filtros extremos de saturación, contraste y ruido. A pesar del caos visual, las estructuras arquitectónicas conservan siluetas y "huellas dactilares" distintivas.

Fase de Explotación

Paso 1 — Reconocimiento de Patrones Visuales
Al ignorar el ruido digital, identificamos rasgos arquitectónicos clave: construcción en ladrillo rojo, ornamentación cerámica detallada y arcos inspirados en el gótico. Estos elementos son característicos del **Modernisme Català**, surgido en la Barcelona de principios del siglo XX.

Paso 2 — Geolocalización e Identificación
Utilizamos herramientas de búsqueda inversa (Google Lens) sobre la imagen distorsionada. A pesar de los filtros, el software logró emparejar las siluetas estructurales y la paleta de colores con el **Hospital de Sant Pau** en Barcelona, un conjunto modernista declarado Patrimonio de la Humanidad por la UNESCO.

Paso 3 — Investigación de Autoría
El requisito final era identificar a la "mente maestra" tras el diseño. Los registros históricos confirman que el complejo del Hospital de la Santa Creu i Sant Pau fue diseñado por el célebre arquitecto **Lluís Domènech i Montaner**.

Paso 4 — Obtención de la Flag
La bandera corresponde al nombre del autor: **SoterCTF{Lluís_Domènech_i_Montaner}**.

Lecciones Aprendidas
Los retos de OSINT con imágenes distorsionadas premian el reconocimiento de patrones frente a la extracción directa de datos. Identificar un estilo artístico o arquitectónico específico permite acotar rápidamente el área de búsqueda cuando los metadatos han sido eliminados.`
      },
      { id: 18, name: "Sanity check", category: "MISC", description: "Únete al servidor de Discord de SoterCTF y encuentra la flag escondida entre los canales. https://discord.gg/qfvhzhxTW9" },
      {
        id: 19, name: "The Space Man", category: "Explotación de binarios",
        description: "La nave ha entrado en estado crítico. Durante el viaje, un fallo en el sistema automático ha activado el protocolo de emergencia: hibernación total. Todas las compuertas han quedado selladas. La central informa de la existencia de dos tarjetas de acceso necesarias para recuperar el control… pero el sistema de seguridad ha endurecido sus defensas. Nada responde. Todo está bloqueado. Encuentra las tarjetas. Abre las compuertas. Sobrevive. Y vuelve a casa, camarad.",
        resolution: `Explotación / Análisis

Paso 1 — Cargar Assembly
- Abrimos Assembly-CSharp.dll en ILSpy o dnSpy
- Navegamos por las clases
- Encontramos una clase interesante: (Metodo de busqueda "flag" en el codigo)

Paso 2 — Identificar lógica de la Flag

Código relevante:
private string flagEncriptada = "U290ZXJDVEZ7RDNmZW41RV9zMVNUM21fZEk1NWFCbGVkfQ==";

Y la función de decodificación:
byte[] bytes = Convert.FromBase64String(flagEncriptada);
return Encoding.UTF8.GetString(bytes);

La Flag es simplemente texto codificado en Base64

Paso 3 — Decodificar Base64 con Python
(Revisa el bloque Payload para ver el script de obtención de la flag en Python)`
      }
    ]
  },
  ca: {
    practice: "Reptes de Pràctica",
    comp: "COMPETICIÓ PALCAM CG 2026",
    mastering: "Dominant el",
    cyber_battlefield: "Camp de Batalla Cibernètic",
    hero_desc: "Explora writeups detallats per als reptes del SoterCTF Palcam CG 2026. Mostrant metodologies de resolució de problemes, enginyeria inversa i desenvolupament d'exploits.",
    prize: "Premi Principal",
    challenges: "Reptes",
    certified: "Certificat de Compleció",
    pts: "pts",
    insights: "Detalls del Repte:",
    resolution: "Resolució:",
    flag: "Bandera Capturada:",
    payload: "Exploit / Payload:",
    copy: "Copiar",
    copied: "Copiat!",
    built_for: "Creat per a la",
    ctf_comp: "competició de writeups de SoterCTF",
    survey: "Enquesta de Competició",
    view_chal: "Veure Reptes",
    rights: "© 2026 Carriedo. Tots els drets reservats.",
    featured: "Writeups Destacats",
    loading: "Carregant components...",
    task: "Tasca",
    challengeData: [
      {
        id: 1, name: "Caïssa", category: "Criptografia",
        description: "Durant la missió Nebula-12, es va enviar una transmissió secreta a la Terra amb dades vitals de la missió. La teva tasca és descodificar el senyal interceptat i recuperar el missatge ocult.",
        resolution: `Anàlisi i Reconeixement
En inspeccionar l'output, ens adonem que no són dades directes, sinó diferències codificades en hexadecimal. Això suggereix que hi ha diverses capes de codificació: compressió (tipus Golomb), bit-packing en blocs de 5 bits i codificació Delta.

Fase d'Explotació

Pas 1 — Invertir la codificació Delta
El primer pas és revertir l'array de diferències utilitzant una suma acumulativa per tal de reconstruir el flux d'enters original.

Pas 2 — Reconstruir el Bitstream
Com que cada valor representa un fragment de 5 bits, desempaquetem els valors recuperant el flux original d'uns i zeros mitjançant operacions a nivell de bit.

Pas 3 — Força Bruta del Mòdul (Golomb Decoding)
Sabent que l'algorisme empra una codificació tipus Golomb amb un mòdul 'm' desconegut, iterem sobre l'espai possible (entre 100 i 200, en múltiples de 4). El mòdul correcte (m=104) revela instantàniament la bandera en text pur.

Lliçons Apreses
Una codificació en múltiples etapes sovint oculta un model matemàtic senzill. Identificar la codificació Delta inicial va ser crític per poder restaurar les dades a nivell de bit.`
      },
      {
        id: 2, name: "Bank", category: "MISC",
        description: "Un grup de furoners ha aconseguit accés al servidor intern de PalCam Bank. Per arribar a un compte privilegiat, hauràs de superar tres capes de seguretat.",
        resolution: `Anàlisi i Reconeixement
En revisar el codi i la forma en què la connexió ens demana les credencials, descobrim una vulnerabilitat crítica: l'script d'autenticació utilitza la funció nativa 'input()' de Python 2 per recollir el PIN i el Token de l'usuari.

Fase d'Explotació

Pas 1 — Comprendre la fallada d' 'input()'
A Python 2, la funció 'input()' avalua el text introduït com a codi actiu (equivalent a un 'eval()'). Això permet injectar i accedir a variables dinàmiques directament des de la memòria.

Pas 2 — Bypass del PIN
El PIN en memòria es valida contra el diccionari 'users'. En lloc d'intentar endevinar un PIN aleatori, quan el terminal ens el demana a l'input escrivim directament la sintaxi 'users[username]'. Això resol dinàmicament la referència del PIN correcte i ens permet avançar!

Pas 3 — Bypass del Token Dinàmic
L'última capa valora un token de temps, PID i un hash SHA1 que de pas es manté a la variable de memòria 'real_token'. En l'últim pas, quan ens sol·licita el token final, simplement aportem 'real_token'. El sistema avalua la nostra entrada igualant l'espai de memòria amb ell mateix i cedint l'accés.

Lliçons Apreses
Mai s'ha d'emprar 'input()' en Python 2 per processar text que ve dels usuaris; 'raw_input()' és d'ús obligatori de forma segura, o s'ha d'actualitzar nativament a Python 3. Una bona autenticació ha d'aïllar estrictament les variables del seu àmbit local d'execució.`
      },
      {
        id: 3, name: "Cosmos Strike", category: "Web",
        description: "Orbital Strike és un shooter 3D en el navegador ambientat a la Lluna.\n\nHi ha un secret a /bossboard.php",
        resolution: `Anàlisi i Reconeixement
A l'explorar l'aplicació, notem la pista que apunta a '/bossboard.php'. Tot i que probablement no tinguem accés directe a les dades, un bot administrador revisa constantment aquesta taula de puntuacions. Aquest és l'escenari clàssic per a un atac de **Cross-Site Scripting (XSS) Cec**.

Fase d'Explotació

Pas 1 — Injecció del Payload XSS
Donat que podem registrar-nos com a pilots al joc, la vulnerabilitat resideix en la falta de sanitització del nom d'usuari. Al registrar-nos, en lloc d'un àlies normal, injectem un payload de JavaScript que forci al visitant a exfiltrar informació cap al nostre servidor controlat (per exemple, utilitzant Webhook.site).

Pas 2 — Exfiltració Executada
Juguem per garantir que la nostra puntuació aparegui a '/bossboard.php'. Quan el bot administrador accedeix a la pàgina per revisar el tauler, el nostre script injectat s'executa al seu navegador local (reflectit en el referer 'http://127.0.0.1:8000'), capturant la flag secreta i enviant-la en la sol·licitud GET.

Pas 3 — Recepció i Descodificació
En revisar el nostre panell de Webhook.site, observem l'arribada de la petició GET. La variable injectada 'flag=' extrau una cadena en Base64. En descodificar-la, obtenim en text clar la bandera capturada.

Lliçons Apreses
Els atacs XSS emmagatzemats cecs (Blind XSS) són letals als taulers d'administració. Qualsevol entrada que s'acabi reflectint a una pantalla administrativa s'ha de sanititzar estrictament abans de renderitzar-se en l'HTML.`
      },
      {
        id: 4, name: "Random Lunar Primes", category: "Criptografia",
        description: "A la superfície lunar, una nau detecta un senyal misteriós format per nombres primers. Pots desxifrar el codi i descobrir el missatge abans que sigui massa tard?",
        resolution: `Anàlisi i Reconeixement
En inspeccionar el codi font de l'esquema de xifratge, descobrim que els "nombres primers" en realitat actuen com un simple esquer per a la generació de soroll, no formen part de la resolució matemàtica. La codificació real es basa en una clau determinística petita i aritmètica modular: 'C[i] = ord(flag[i]) + key[i] ^ key[-i]'.

Fase d'Explotació

Pas 1 — Recuperar el primer segment de la clau
Notem que els valors generats per 'key' sempre romanen en el rang de [0, 23]. Donat aquest espai tan petit, podem iterar amb força bruta el valor de 'key[0]' esperant trobar la constant que produeix caràcters en rang ASCII vàlida (32-126).

Pas 2 — Reconstruir la Clau Completa
Un cop deduït el segment zero, a causa de la linealitat determinística revelada en la funció de generació ('[k0 + i] % 24'), reconstruïm l'array de la clau per complet.

Pas 3 — Desencriptar la Flag
Deconstruint la fórmula matemàtica inicial 'flag[i] = C[i] - (key[i] ** key[-i])', iterem sobre la matriu final restant la suma exponencial de les nostres claus resoltes, aconseguint iterativament la conversió als caràcters originals de la bandera.

Lliçons Apreses
Els espais de clau modulars tan reduïts conviden instantàniament als atacs de força bruta. L'encriptació basada en exponenciació, quan no té límits gegantins, resulta vulnerable si la clau s'exposa.`
      },
      {
        id: 5, name: "Concrete Frequency", category: "OSINT",
        description: "Hem interceptat aquesta fotografia d'un informant. Sabem que està a Barcelona, però hem de triangular la seva posició exacta.",
        resolution: `Anàlisi i Reconeixement
Aquest repte d'Intelligència de Fonts Obertes (OSINT) demana aplicar tècniques de triangulació geogràfica combinades amb recerca en arxius històrics. Vam començar utilitzant una cerca inversa d'imatges i validant horitzons muntanyosos de la ciutat de Barcelona.

Fase d'Explotació

Tasca 1 — Identificació de l'Horitzó
En fixar-nos en la inconfusible silueta escampada a l'últim pla de la muntanya, reconeixem ràpidament la icònica agulla de comunicacions: la **Torre de Collserola**. Aquesta ens concedeix la primera 'flag'.

Tasca 2 — Toponímia del Turó
L’indret exacte on asseu el subjecte fotogràfic es coneix popularment com els "Búnquers del Carmel". Malgrat això, el repte ens exigeix la geografia oficial sota mapes cartogràfics formals. Creuant dades cadastrals, l'elevació d'aquesta colina respon l'autèntic nom de **Turó de la Rovira**.

Tasca 3 — Artilleria i Context Històric
Coneixent el passat d'aquest promontori com a bateria antiaèria durant la Guerra Civil Espanyola en defensa de la ciutat, busquem al catàleg d'armament bèl·lic i cartografia històrica. L’arxiu militar certifica que originalment la zona tenia instal·lats 4 imponents canons: l'artilleria **Vickers 105 mm**.

Lliçons Apreses
Pels reptes d'OSINT urbà, no ens hem de conformar amb mots populars d'aparença senzilla, és vital validar el nom històric original. Emparellar fites geogràfiques de relleu amb arxius arquitectònics resulta essencial per localitzar informació encadenada.`
      },
      {
        id: 6, name: "Blue Crystal Crumbs", category: "OSINT",
        description: "Agent, la DEA ha detectat la reaparició d'un producte d'alta puresa als carrers. Rastrea la petjada digital del cuiner sota l'àlias Heisenberg_Kross69.",
        resolution: `Anàlisi i Reconeixement
Iniciem la recerca focalitzant-nos en l'àlies 'Heisenberg_Kross69' suggerit. Després de rastrejar per diverses xarxes socials, trobem ràpidament un perfil públic actiu a la plataforma Mastodon.

Fase d'Explotació

Tasca 1 — Seguretat Operacional (OpSec)
En revisar la cronologia del seu perfil a Mastodon, ens fixem que la seva primera publicació conté l'historial d'edició obert. A l'inspeccionar les versions anteriors del missatge, comprovem que originalment havia publicat el seu correu electrònic de contacte i posteriorment ho havia "esborrat".

Tasca 2 — Anàlisi de Metadades Documentals
L'objectiu va compartir enllaços a documents tècnics sobre sistemes de filtratge. En descarregar aquests PDFs i analitzar-los amb una eina forense de metadades (ex. ExifTool), descobrim informació oculta en el camp "Creador / Organització", el qual assenyala al proveïdor: **Madrigal Electromotive**.

Tasca 3 — Intel·ligència Visual (IMINT) i Geolocalització
A la pista visual pujada al seu compte, s'observa el seu proper punt de trobada il·luminat per neons a 'Central Ave'. Empilant coneixement de mapes i contrastant l'estructura mitjançant Google Street View, determinem que el local comercial on es portarà a terme l'intercanvi és l'emblemàtic **Dog House Drive-In**.`
      },
      {
        id: 7, name: "Galactic Breach", category: "Web",
        description: "Els servidors de SoterCTF han estat piratejats per ciberdelinqüents. La teva missió és recuperar les dades de Galactic Dominion.",
        resolution: `Anàlisi i Reconeixement
El repte presenta un formulari de cerca de planetes i galàxies. En injectar caràcters especials al camp de dades, vam observar un error de PHP que feia referència a \`SimpleXMLElement::xpath()\`. Això confirma una vulnerabilitat d'**Injecció XPath**.

Fase d'Explotació

Pas 1 — Prova de Lògica
L'aplicació utilitza l'entrada per filtrar nodes en una base de dades XML. Vam provar la injecció amb l'operador \`|\` (OR) per comprovar si podíem annexar les nostres pròpies consultes. En enviar \`minerals | //*\`, vam confirmar que podíem seleccionar tots els nodes del document.

Pas 2 — Cerca de la Bandera
Coneixent el format de la bandera, vam dissenyar un payload per buscar qualsevol node que contingués la cadena 'SoterCTF':
\`minerals | //*[contains(text(), 'SoterCTF')]\`

Pas 3 — Extracció
El servidor va processar la consulta modificada i va mostrar directament el node de la bandera als resultats de la cerca.

Lliçons Apreses
Les entrades utilitzades en consultes XPath s'han de sanitizar estrictament. La concatenació directa d'entrada d'usuari en cadenes de consulta XML permet la navegació completa per l'estructura del document.`
      },
      {
        id: 8, name: "Random Moon Base", category: "Criptografia",
        description: "Durant una missió de reconeixement en un cràter fosc, una nau espacial detecta una antiga estructura sota la pols lunar. A mesura que s'acosta, l'estructura emet una sèrie de patrons lluminosos que semblen seguir un ordre específic.",
        resolution: `Anàlisi i Reconeixement
Aquest repte utilitza un flux de codificació de múltiples capes basat en la conversió de base i la substitució de caràcters. Vam deduir que la bandera es converteix en un enter gran, es passa a una base numèrica entre 10 i 60, i finalment es mapeja a través d'un alfabet desordenat.

Fase d'Explotació

Pas 1 — Identificació de la Feblesa
La vulnerabilitat clau és la llavor determinista utilitzada per desordenar l'alfabet. El sistema fa servir \`random.seed(base * len(alphabet))\`, la qual cosa significa que l'ordenació és totalment predictible per a cada base. Atès que el rang de bases és petit (10-60), l'espai de claus és vulnerable a la força bruta.

Pas 2 — Estratègia de Força Bruta
Vam programar un "solver" en Python que itera per totes les bases possibles. Per a cada base:
1. Re-genera l'alfabet desordenat corresponent.
2. Inverteix el mapeig de caràcters per recuperar els dits originals.
3. Transforma els dits de base-N a un enter i, finalment, a ASCII.

Pas 3 — Extracció
En trobar la base exacta (47), el descompressor revela la bandera en format text: **SoterCTF{53ee28c5...}**.

Lliçons Apreses
Combinar diverses capes de codificació feble no substitueix una criptografia robusta. L'ús de llavors predictibles per a permutacions "aleatòries" fa que el sistema sigui trivial de revertir si l'espai de cerca és reduït.`
      },
      {
        id: 9, name: "Whispers of the Old Castle", category: "OSINT",
        description: "Un usuari anònim ha pujat a una plataforma pública una fotografia aèria d'una finca històrica situada a Europa. Identifica la seva ubicació i el seu creador.",
        resolution: `Anàlisi i Reconeixement
Aquest repte planteja una investigació OSINT integral que combina la geolocalització visual, la recerca de dades històriques i la identificació d'atribució digital en plataformes de mapes.

Fase d'Explotació

Pas 1 — Delimitació Geogràfica
A partir de l'estil arquitectònic i el paisatge de la fotografia aèria, vam acotar la cerca a l'Europa mediterrània, identificant Espanya com el país on s'alça la finca.

Pas 2 — Identificació del Castell
Utilitzant la cerca inversa i comparant l'estructura de les torres i la geometria del recinte, vam confirmar que es tracta del **Castell de Sant Marçal**.

Pas 3 — Recerca Històrica
En investigar la titularitat de la fortalesa, vam descobrir que fou adquirida per la família Marimón el 1225. Seguint el llinatge fins als nostres dies, comprovem que actualment pertany a la **Família Trénor**.

Pas 4 — Atribució Digital (IMINT)
L'últim pas consistia en trobar l'autor de la imatge aèria. Situant-nos en les coordenades exactes en vista de satèl·lit i revisant els crèdits de les fotografies 360/panoràmiques, vam localitzar l'usuari **matauira_chin_ah_you**.

Lliçons Apreses
L'OSINT és un procés d'eliminació progressiva. Una imatge "neta" de metadades tècniques encara conté informació contextual i d'atribució digital si es sap on buscar dins les capes d'informació de la xarxa.`
      },
      {
        id: 10, name: "Strange message", category: "MISC",
        description: "M'he trobat amb uns arxius d'àudio molt estranys en un USB... Sonen distorsionats.",
        resolution: `Anàlisi i Reconeixement
El repte proporciona un fitxer d'àudio que conté un soroll estructurat i periòdic. Aquest perfil acústic és el típic de la **Televisió de Barrit Lent (SSTV)**, un protocol utilitzat per transmetre imatges a través de canals d'àudio de banda estreta.

Fase d'Explotació

Pas 1 — Identificació del Senyal
Mitjançant un analitzador de forma d'ona com Audacity, vam inspeccionar la freqüència i la durada dels polsos. Els patrons de to van confirmar un format de codificació SSTV, una tècnica d'esteganografia clàssica en CTFs.

Pas 2 — Descodificació de l'Àudio
Vam processar l'àudio amb un descodificador SSTV (com RX-SSTV o QSSTV). En activar l'autodetecció del mode de transmissió, el programari va començar a reconstruir una imatge a partir de la senyal d'àudio en temps real.

Pas 3 — Extracció
La imatge resultant, un cop renderitzada totalment, contenia el text llegible de la bandera: **SoterCTF{h3ll0_fRo0oM_th3_m00n!}**.

Lliçons Apreses
Les senyals d'àudio poden amagar informació visual complexa. En reptes de categoria MISC, el soroll estructurat sovint oculta dades en el domini de la freqüència, requerint descodificadors específics per recuperar el payload.`
      },
      {
        id: 11, name: "Asteroid Pathfinder", category: "Programació",
        description: "Implementa un algoritme de cerca de rutes (ex. A*) per trobar la ruta més curta des de l'inici fins al final en un camp d'asteroides.",
        resolution: `Anàlisi i Reconeixement
Aquest repte ens situa en un camp d'asteroides representat per una quadrícula ASCII. L'objectiu és trobar la ruta més curta entre dos punts en un laberint complex format per espais buits (\`.\`) i obstacles (\`#\`). Atesa la mida del mapa, cal implementar una solució programàtica eficient.

Fase d'Explotació

Pas 1 — Parseig de Dades
Vam carregar el mapa des del diccionari de Python, convertint les llistes de cadenes en una graella de coordenades. Vam definir els moviments vàlids: només amunt, avall, esquerra i dreta.

Pas 2 — Selecció de l'Algoritme
Per garantir la ruta més curta en un mapa d'aquest tipus, vam optar per l'algoritme **Breadth-First Search (BFS)**. Aquest mètode explora tots els camins possibles de forma concèntrica, garantint que el primer cop que arribem al destí ho fem pel camí més curt.

Pas 3 — Implementació i Càlcul
Vam programar un algorisme de cerca que utilitza una cua per gestionar els nodes pendents i un conjunt per als visitats. El script manté el recompte de passos acumulats fins a arribar a la meta.

Pas 4 — Extracció de la Bandera
En executar el script sobre el dataset proporcionat, vam obtenir un resultat de **158 passos**, que conforma la bandera final.

Lliçons Apreses
La cerca de camins (pathfinding) és un pilar fonamental de la programació competitiva. Saber distingir quan utilitzar BFS (per a rutes curtes en grafs no pesats) o Dijkstra/A* (per a rutes amb costos variable) és essencial per resoldre aquest tipus d'enigmes de forma òptima.`
      },
      {
        id: 12, name: "A lot of Squares", category: "Programació",
        description: "Treballa amb el quadrat llatí de grandària n. Genera tots els quadrats llatins possibles d'ordre 5.",
        resolution: `Anàlisi i Reconeixement
Aquest repte ens demana treballar amb un objecte combinatori clàssic: el Quadrat Llatí d'ordre 5 ($n=5$). En un Quadrat Llatí, cada nombre de l'1 al $n$ ha d'aparèixer exactament una vegada en cada fila i en cada columna. Davant la magnitud del nombre de combinacions possibles, cal emprar una cerca amb **backtracking** i poda de branques per resoldre-ho de forma factible.

Fase d'Explotació

Pas 1 — Disseny de l'Algoritme
Vam implementar un procés recursiu de backtracking que construeix el quadrat fila per fila. En cada inserció, l'algoritme comprova que el valor no es repeteixi en les columnes dels nivells anteriors, descartant camins invàlids de forma prematura.

Pas 2 — Generació i Càlcul
Vam utilitzar totes les permutacions de {1, 2, 3, 4, 5} com a candidates per a cada fila. El script genera de forma exhaustiva tots els quadrats possibles seguint les regles de col·locació estrictes.

Pas 3 — Serialització i Hash
Un cop obtinguts tots els quadrats, vam aplicar un "pipeline" de processament de dades per arribar a la bandera:
1. **Aplanament (Flattening)**: Conversió de cada quadrat a una cadena de 25 caràcters.
2. **Ordenació**: Classificació de totes les cadenes en ordre lexicogràfic.
3. **Concatenació**: Unió de totes les dades en un únic string gegant.
4. **Hashing**: Càlcul de l'MD5 del string resultant.

Pas 4 — Extracció de la Bandera
El procés va generar un total de 161.280 quadrats llatins, donant com a resultat el codi final: **SoterCTF{7954879fb82686cebd9ad7c2c3ee8ce0}**.

Lliçons Apreses
L'ordenació de la sortida és crítica en reptes de resum combinatori. Fins i tot amb una generació correcta, qualsevol variació en l'ordre de les dades o en el mètode de concatenació canvia completament el hash resultant.`
      },
      {
        id: 13, name: "A lot of Queens", category: "Programació",
        description: "El trencaclosques de les 8 reines és un problema clàssic: col·loca 8 reines en un tauler de 8x8 de manera que no s'amenacin. Troba totes les combinacions vàlides.",
        resolution: `Anàlisi i Reconeixement
El trencaclosques de les "8 Reines" és un problema clàssic de satisfacció de restriccions que consisteix a col·locar 8 reines en un tauler de $8 \times 8$ de manera que no s'amenacin entre elles (cap reina pot compartir fila, columna o diagonal).

Fase d'Explotació

Pas 1 — Reducció de l'Espai de Cerca
Atès que cada fila ha de tenir una sola reina, podem modelar cada solució com una permutació dels índexs de columna $[0, 1, ..., 7]$. Això redueix l'espai de cerca de $8^8$ a només $8! = 40.320$ combinacions possibles.

Pas 2 — Validació de Diagonals
Vam programar un validador per detectar conflictes en les rutes diagonals. Per a qualsevol parell de reines (x1, y1) i (x2, y2), hi ha conflicte si |x1 - x2| == |y1 - y2|. Aplicant aquest filtre, vam obtenir les 92 solucions vàlides del problema.

Pas 3 — Serialització i Hash
Per arribar a la bandera, vam seguir un procés de serialització estricte:
1. **Codificació**: Cada solució es representa com una cadena de 8 dígits.
2. **Ordenació**: Classificació de les 92 solucions en ordre lexicogràfic.
3. **Concatenació**: Unió de totes les cadenes en un sol bloc.
4. **Hashing**: Càlcul de l'MD5 del string final.

Pas 4 — Extracció de la Bandera
El conjunt total de solucions processades genera el hash: **SoterCTF{5f805477c1a1f2ec689efeb95bfa56ea}**.

Lliçons Apreses
Els problemes clàssics de combinatòria sovint s'amaguen darrere de reptes de programació en CTFs. La clau resideix en saber simplificar l'espai de cerca i aplicar correctament les regles de validació geomètrica.`
      },
      {
        id: 14, name: "Twins", category: "Programació",
        description: "Escriu un programa per calcular quants parells de primers bessons existeixen entre 1 i 123 456 789.",
        resolution: `Anàlisi i Reconeixement
L'objectiu és comptar les parelles de "primers bessons" $(p, p+2)$ que existeixen entre l'1 i el 123.456.789. Atès que el límit és molt elevat (prop de 123 milions), l'ús d'una criba d'Eratòstenes convencional resultaria inviable per falta de memòria RAM.

Fase d'Explotació

Pas 1 — Selecció de l'Algoritme
Per processar un rang tan extens de forma eficient, vam implementar una **Criba Segmentada**. Aquesta tècnica divideix l'interval total en blocs o segments més petits, permetent realitzar el càlcul amb un consum de memòria molt reduït però mantenint una alta velocitat d'execució.

Pas 2 — Precalcul de Primers Base
Primer vam calcular tots els nombres primers fins a la rel quadrada del límit ($\\sqrt{123.456.789} \\approx 11.111$). Aquests primers ens serviran com a base per marcar els múltiples en la resta de segments del rang total.

Pas 3 — Flux de Treball i Recompte
Vam processar la graella en blocs d'un milió de números. Per cada segment:
1. Vam eliminar els múltiples dels primers base precalculats.
2. Vam identificar els números primers restants i vam comprovar la distància amb el primer anterior.
3. Si la diferència entre dos primers consecutius era exactament 2, vam sumar una unitat al comptador de bessons.

Pas 4 — Extracció de la Bandera
Mantenint l'estat del "darrer primer trobat" entre les fronteres de cada segment, vam garantir la precisió del recompte final: **530.477** parelles de primers bessons.

Lliçons Apreses
L'optimització de la memòria és tan crítica com la potència de càlcul en problemes de teoria de nombres. Les algorismes segmentats són essencials per processar grans volums de dades que superen la capacitat de la memòria física del sistema.`
      },
      {
        id: 15, name: "Access denied", category: "Enginyeria Inversa",
        description: "Només l'elit de l'agència espacial pot accedir a aquest programa, pots trobar la contrasenya?",
        resolution: `Anàlisi i Reconeixement
El repte presenta un binari que demana una contrasenya per permetre l'accés. Mitjançant una anàlisi estàtica inicial, vam plantejar la hipòtesi que la bandera podria estar incrustada directament en les seccions de dades del programa, sense necessitat de revertir lògica complexa.

Fase d'Explotació

Pas 1 — Inspecció de Memòria Estàtica
Vam utilitzar \`objdump\` per examinar les seccions internes del binari. La secció \`.rodata\` va revelar un patró repetitiu de 4 bytes que indicava dades estructurades.

Pas 2 — Identificació de l'Ofuscació
Vam observar que la bandera estava emmagatzemada com una sèrie d'enters de 32 bits en format little-endian. Cada caràcter estava acompanyat per tres bytes nuls (ex: \`53 00 00 00\`). Aquesta és una tècnica d'ofuscació senzilla per evitar el programa \`strings\`.

Pas 3 — Extracció i Reconstrucció
Vam bolcar els valors hex de la secció \`.rodata\` i vam convertir aquests valors de 32 bits als seus caràcters ASCII corresponents per reconstruir el text original.

Pas 4 — Extracció de la Bandera
La seqüència desxifrada va mostrar la bandera: **SoterCTF{fc0a143ff035763e07bf123813915733}**.

Lliçons Apreses
Els reptes de "Control d'Accés" no sempre requereixen un desmuntatge profund del codi. Començar per una inspecció exhaustiva de les seccions de dades com \`.rodata\` és una bona pràctica de RE.`
      },
      {
        id: 16, name: "Pentest Report", category: "Forense",
        description: "Tal com va ser sol·licitat, reenviem l'informe d'avaluació de vulnerabilitats basat en les proves que vam realitzar l'altre dia. Hem retallat la captura de pantalla per garantir que no es vegi cap informació extreta de la base de dades.",
        resolution: `Anàlisi i Reconeixement
El repte proporciona un informe de pentesting en format Google Docs. La descripció indica que una imatge ha estat "retallada" per motius de privacitat. En l'àmbit de la forense digital, retallar una imatge en un editor web sovint és una acció no destructiva: l'editor simplement amaga una part de l'objecte visualment, però l'arxiu original segueix sencer dins el document.

Fase d'Explotació

Pas 1 — Investigació de Renderitzat
Els editors de documents al núvol utilitzen JavaScript per aplicar les restriccions visuals de la interfície. Si canviem l'endpoint de renderitzat a la versió de mòbil (afegint \`/mobilebasic\` a la URL), podem evitar algunes d'aquestes capes d'edició dinàmica.

Pas 2 — Evasió de Restriccions de la interfície
La vista \`/mobilebasic\` és una versió estàtica del document. En molts casos, aquest mode no és capaç de processar correctament les màscares de retall del editor d'escriptori, mostrant l'objecte original en la seva totalitat.

Pas 3 — Recuperació i Anàlisi
Una alternativa és desactivar el JavaScript del navegador. Això obliga a carregar una versió de "només lectura" en HTML bàsic on les imatges "retallades" es desborden de les seves caixes de clipping, revelant la informació que es pretenia ocultar.

Pas 4 — Extracció de la Bandera
Identificant la imatge original sense les capes de retall de Google Docs, vam poder llegir les dades de la base de dades on es trobava la bandera: **SoterCTF{ad3f2da471766134a2430af75ecd0e15}**.

Lliçons Apreses
La seguretat basada en "ocultar" elements visualment és fràgil. Els editors moderns mantenen els fitxers originals per permetre el "revertir" canvis. Els investigadors han de provar sempre visualitzacions alternatives o modes de compatibilitat per accedir al contingut cru dels actius digitals.`
      },
      {
        id: 17, name: "Deep Fried Discovery", category: "OSINT",
        description: "Identifica aquest imposant recinte hospitalari i descobreix a la ment mestra que el va dissenyar malgrat la distorsió digital.",
        resolution: `Anàlisi i Reconeixement
Aquest repte presenta una imatge amb un efecte "deep fried", és a dir, amb una distorsió extrema de color, contrast i soroll digital. L'objectiu és identificar un monument arquitectònic i el seu autor malgrat l'intent d'ocultació visual.

Fase d'Explotació

Pas 1 — Reconeixement d'Estil
Malgrat la distorsió, són visibles trets inconfusibles: l'ús del maó vist, la ceràmica ornamental i les formes pròpies del **Modernisme Català**. Aquests elements permeten situar la cerca, d'entrada, a la ciutat de Barcelona.

Pas 2 — Geolocalització i Identificació
Vam fer servir la cerca inversa d'imatges (Google Lens). Tot i els filtres, l'algoritme va reconéixer les estructures de l'**Hospital de Sant Pau** (Hospital de la Santa Creu i Sant Pau).

Pas 3 — Investigació de l'Autor
Un cop identificat el recinte hospitalari, vam cercar la figura de l'arquitecte responsable. El "mestre" que va signar aquest llegat històric és **Lluís Domènech i Montaner**, una de les figures més rellevants del modernisme català.

Pas 4 — Extracció de la Bandera
La bandera és el nom complet de l'arquitecte: **SoterCTF{Lluís_Domènech_i_Montaner}**.

Lliçons Apreses
La distorsió digital rarament pot esborrar la identitat d'una obra arquitectònica amb un estil tan marcat. En OSINT, saber identificar estils artístics o patrons constructius és una eina poderosa per geolocalitzar imatges quan falten els metadatos tècnics.`
      },
      {
        id: 18, name: "Sanity check", category: "MISC",
        description: "Uneix-te al servidor de Discord de SoterCTF i troba la flag amagada entre els canals."
      },
      {
        id: 19, name: "The Space Man", category: "Explotació de binaris",
        description: "La nau ha entrat en estat crític. Durant el viatge, una fallada en el sistema automàtic ha activat el protocol d'emergència: hibernació total. Totes les comportes han quedat segellades. La central informa de l'existència de dues targetes d'accés necessàries per recuperar el control... però el sistema de seguretat ha endurit les seves defenses. Res respon. Tot està bloquejat. Troba les targetes. Obre les comportes. Sobreviu. I torna a casa, camarada.",
        resolution: `Explotació / Anàlisi

Pas 1 — Carregar Assembly
- Obrim Assembly-CSharp.dll a ILSpy / dnSpy
- Naveguem per les classes
- Trobem una classe interessant: final

Pas 2 — Identificar lògica de la Flag

Codi rellevant:
private string flagEncriptada = "U290ZXJDVEZ7RDNmZW41RV9zMVNUM21fZEk1NWFCbGVkfQ==";

I la funció de descodificació:
byte[] bytes = Convert.FromBase64String(flagEncriptada);
return Encoding.UTF8.GetString(bytes);

👉 La Flag és simplement text codificat en Base64

Pas 3 — Descodificar Base64 amb Python
(El script es troba al bloc inferior de Payload / Exploit)`
      }
    ]
  }
};
