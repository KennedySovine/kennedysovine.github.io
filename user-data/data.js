// This file is now split into multiple files. See bio.js, skills.js, experience.js, modules.js, certifications.js, education.js, footer.js, moduleGrades.js, projects-data.js

export const bio = [
  "University of Brighton student pursuing a BSc in Computer Science for Games, specializing in backend systems and plugin development for Minecraft servers. As a developer for a Minecraft server, contributed to gameplay enhancements and infrastructure design, collaborating closely with teams and content creators like Fundy to deliver engaging experiences.",
  "Supported by a solid foundation in Java and C#, worked on scalable multiplayer systems and technical implementation. Passionate about solving complex problems, creating seamless player interactions, and driving innovation in game development environments.",
];

export const skills = [
  "Java",
  "C++",
  "C#",
  "Unity",
  "Object-Oriented Programming",
];

export const experience = [  {
    title: "IridiumMC",
    duration: "Febuary 2025 - Present",
    location: "Remote",
    subtitle: "Developer",
    details: [
      "Working on Minecraft server as a developer. ",
      "When started, I will be the head developer for the Prisons server on the server.",
      "I have worked and assisted with the server thus far and helped with creating YouTube videos for the YouTuber 'Fundy'.",
    ],
    tags: ["Java", "Kotlin", "Minecraft", "Plugin Development", "Game Development", "Maven"],
    icon: " ",
  },
  {
    title: "SootMC",
    duration: "July 2023 - February 2024",
    subtitle: "Trial Developer",
    location: "Remote",
    details: [
      "Worked on Java and Kotlin-based Minecraft plugins, contributing to the SootMC project.",
      "Developed and maintained plugins for Minecraft servers, enhancing gameplay and server functionality.",
      "Collaborated with a team of developers to implement new features and fix bugs in the plugin ecosystem.",
    ],
    tags: [
      "Java",
      "Kotlin",
      "Minecraft",
      "Plugin Development",
      "Game Development",
      "Maven",
    ],
    icon: "",
  },
  {
    title: "DoorDash",
    duration: "April 2022 - September 2022",
    subtitle: "Food Delivery Driver",
    location: "Greater Nashville Metro Area, TN, USA",
    details: [
      "I learned how to navigate my town better and learned how to utilize phone capabilities to deliver food and other items to the customer on time, often arriving earlier than expected",
    ],
    tags: ["Customer Service", "Time Management", "Navigation"],
    icon: "car",
  },
  {
    title: "Center for Medical Interoperability",
    duration: "November 2019 - February 2020",
    location: "Nashville, TN, USA",
    subtitle: "Student Intern",
    details: [
      "In this internship, I learned the networking and engineering aspects that go into the development of the devices used in medical fields.",
    ],
    tags: ["Interoperability", ],
    icon: "group",
  },
];

export const modules = [{
    title: "CI411 - Introduction to Games Programming",
    year: "2022 - 2023",
    semester: "3",
    details: [],
    content: [
      "Problem Solving",
      "Data types and expressions",
      "Core features of C++",
      "Object-Oriented Programming",
      "Game Development",
      "Programming Development Tools and Techniques",
    ],
    githubrepo:"https://github.com/KennedySovine/CI411_Games_Programming ",
  },
  {
    title: "CI410  - Introduction to Game Design and Development",
    year: "2022 - 2023",
    semester: "3",
    details: [],
    content: [
      "History of Computer Games",
      "Video Games and Seizure Safety",
      "Game Accessibility Guidelines",
      "Key elements of game design",
      "Effectively pitching and communicating a design",
      "Creating and editing game assets",
      "Introduction to game frameworks and rapid prototyping",
      "Coordinate systems and the camera",
      "Simple games architecture",
      "Demonstrate the use of the game engine's physics system",
    ],
    githubrepo: "https://github.com/KennedySovine/CI410-Introduction-to-Game-Design-and-Development",
  },
  {
    title: "CI435 - Introduction to Web Development",
    year: "2022 - 2023",
    semester: "3",
    details: [],
    content: [
      "Introduction to web standards",
      "Current web standards and the organisations responsible",
      "Browsers and user agents",
      "Accessibility",
      "Design ethics",
      "Economic context of the development, use, and maintenance of web sites",
      "HTML5/CSS web development",
      "HTML markup – syntax and semantics to structure content",
      "Creating content – text, image, media, forms",
      "Website navigation – lists and anchors",
      "Cascading stylesheets (CSS) – presentation, media queries",
      "Fluid and responsive web page layouts",
      "Testing and validation",
      "Website production",
      "Responsive web design workflow",
      "Web development tools",
      "File organisation and management",
      "Client-side scripting",
      "Introduction to JavaScript",
      "Events and Event Listeners",
      "Document Object Model (DOM) - Accessing and manipulating elements - Dynamically generating elements - Dynamically styling elements",
      "Accessing and validating form values"
    ],
    githubrepo: "https://github.com/KennedySovine/CI435-Introduction-to-Web-Development",
  },
  {
    title: "CI474 - Introduction to 3D Modelling and Animation",
    year: "2022 - 2023",
    semester: "3",
    details: [],
    content: [
      "Production planning, visual research, concept art creation and use",
      "Modelling objects and backgrounds using primitives",
      "Building basic environments: objects, lights and cameras",
      "Object hierarchies and their uses",
      "Creating and modifying meshes and splines",
      "Creating and modifying revolved and lofted objects",
      "Shader materials and texture maps",
      "Basic keyframe animation",
      "3d camera animation",
      "Rendering",
      "Legal, ethical and professional issues within animation",
      "Production planning and time management"
    ],
    githubrepo: "https://github.com/KennedySovine/CI474_Introduction_3D_Modeling_and_Animation",
  },
  {
    title:"CI465 - Working in the Digital and Games Industries",
    year: "2022 - 2023",
    semester: "1",
    details: [],
    content: [
      "National and global economy",
      "Culture, organisations and business models",
      "Working practices in digital enterprises",
      "Careers, employment roles and skills",
      "Legal and ethical issues",
      "Information Security",
      "Creating an online presence",
      "Digital portfolio of work",
      "Platforms for sharing code/design work – e.g., CodePen, Behance",
      "Social media and professional networks",
      "CV writing",
      "Communication using different media",
      "Planning and working in a group and as an individual",
      "Academic writing and referencing",
      "Finding and using information to investigate a topic"
    ],
  },
  {
    title: "CI413 - Game Level and Asset Design",
    year: "2022 - 2023",
    semester: "2",
    details: [],
    content: [
      "Design fundamentals",
      "Visual design",
      "Asset design tools and techniques",
      "Image editing",
      "Audio editing",
      "Defining game levels",
      "The level design and development process",
      "Conceptualising, planning, and designing Levels",
      "Creating level maps and flow diagrams",
      "Playtesting Levels",
      "Designing and creating environments for game levels",
      "Designing level encounters and puzzles"
    ],
    githubrepo: "https://github.com/KennedySovine/CI413-Game-Level-and-Asset-Design",
  },  // LEVEL 5 MODULES
  {
    title: "CI541 - Game Development Frameworks",
    year: "2023 - 2024",
    semester: "1",
    details: [],
    content: [
      "How to choose a game framework",
      "Principles of 3D for games",
      "Advances Games architecture",
      "Problem deconstruction driven object oriented thinking",
      "Screen and World space UI",
      "The Game interaction vs. the visual world",
      "The Player Controller",
      "Non Player Character (NPC) Agent AI",
      "C++ programming",
      "Combining visual programming with C++",
      "Game state serialisation",
      "Advanced materials"
    ],
    githubrepo: "https://github.com/KennedySovine/CI541-Game_Development_Frameworks",
    },
    {
    title: "CI587 - Web Based Game Development",
    year: "2023 - 2024",
    semester: "1",
    details: [],
    content: [
      "Overview of the Document Object Model and HTML5 Canvas",
      "JavaScript games engines, features and application",
      "Physics for games",
      "Simple collision detection techniques",
      "Top down, side scrolling and platform games",
      "Isometric views",
      "Networked games – challenges and opportunities"
    ],
    githubrepo: "https://github.com/KennedySovine/CI587-Web-Development-For-Games",
    },
    {
    title: "CI516 - Artificial Intelligence for Games",
    year: "2023 - 2024",
    semester: "1",
    details: [],
    content: [
      "Implementation of AI elements",
      "AI programming paradigms",
      "AI debugging",
      "Finite state machines",
      "Goal-oriented action planning",
      "Squad tactics",
      "Pathfinding",
      "Decision making",
      "Behaviour AI"
    ],
    githubrepo: "https://github.com/KennedySovine/CI516-AI-for-Games",
    },
    {
    title: "CI517 - Game Engine Fundamentals",
    year: "2023 - 2024",
    semester: "2",
    details: [],
    content: [
      "Game engine architecture",
      "Entity-Component System",
      "Application framework",
      "Physics subsystem",
      "Graphics subsystem",
      "Scripting and domain-specific languages",
      "External tool integration"
    ],
    githubrepo: "https://github.com/KennedySovine/CI517_Game_Engine_Fundamentals",
    },
    {
    title: "CI536 - Integrated Group Project",
    year: "2023 - 2024",
    semester: "2",
    details: [],
    content: [
      "The project lifecycle",
      "Agile project planning, process and management",
      "Understanding and integrating user experience (UX) design",
      "Requirements management",
      "Design techniques Coding, both backend and front end",
      "Testing",
      "Project documentation"
    ],
    githubrepo: "https://github.com/KennedySovine/Integrated-Group-Project",
    },
    {
    title: "CI520 - Narrative Game Design",
    year: "2023 - 2024",
    semester: "2",
    details: [],
    content: [
      "Storytelling basics (e.g., story, plot, narrative arc, character arc, etc.)",
      "Narrative structures (e.g., Three-Act structure, Freytag’s pyramid, Monomyth, Story Circle)",
      "Game structure (e.g., Linear, String of pearls, Branching, Open)",
      "Worldbuilding",
      "Character development",
      "Plot, world, and character archetypes",
      "Dialogue (e.g., Ambient, Interactive, Cutscenes)",
      "Cutscenes and Cinematics",
      "Tools to create narrative-driven games"
    ],
    githubrepo: "https://github.com/KennedySovine/Project-new-world",
    },
  // LEVEL 6 MODULES
  {
    title: "CI601 - Computing Project",
    year: "2024 - 2025", 
    semester: "3",
    details: [],
    content: [
      "Project Proposal",
      "Legal, social and ethical issues",
      "Research and planning",
      "Project management and risk evaluation",
      "Project evaluation",
      "Report writing",
      "Project presentation and Exhibition"
    ],
    githubrepo: "https://github.com/KennedySovine/Final-Project",
  },
  {
    title: "CI628 - Multiplayer Game Development",
    year: "2024 - 2025",
    semester: "1",
    details: [],
    content: [
      "General games architecture",
      "Challenges facing network games",
      "Multiplayer game architectures",
      "Implementation issues and techniques"
    ],
    githubrepo: "https://github.com/KennedySovine/CI628-Multiplayer-Game-Development",
  },
  {
    title: "CI606 - Virtual Reality Systems", // Option for semester 1
    year: "2024 - 2025",
    semester: "1",
    details: [],
    content: [
      "Platforms for development of Virtual Reality systems",
      "Describing content for Virtual Environments",
      "Coordinate systems",
      "Hardware platforms",
      "Animations",
      "Interaction methods",
      "Motion tracking"
    ],
    githubrepo: "https://github.com/KennedySovine/CI606-Virtual-Reality",
  },
  {
    title: "CI620 - Intellectual Property Law and IT", // Option for semester 2
    year: "2024 - 2025",
    semester: "2",
    details: [],
    content: [
      "Why have an Intellectual Property system?",
      "Appreciate the nature of protection offered by Copyright, Confidentiality, Patents, Trademarks, Database, Design and allied rights",
      "Be able to apply the most appropriate forms of protection to IT products",
      "Be able to determine what constitutes infringement and the most appropriate remedies available"
    ],
    githubrepo: "",
  },
  {
    title: "CI646 - Programming Languages, Concurrency and Client Server Computing",
    year: "2024 - 2025",
    semester: "2",
    details: [],
    content: [
      "Historical development of programming languages",
      "Programming paradigms",
      "Languages for concurrent and distributed processing",
      "Modern trends and developments in programming languages",
      "An overview of and mechanisms for achieving client-server computing",
      "Performance and scalability issues in client server computing",
      "Problems of concurrency: resource deadlock, interference, livelock, starvation, component failure, interrupts",
      "Properties of concurrent systems: liveness, safety, fairness, nondeterminism",
      "Definition of real-time systems: hard and soft real-time clocks and timeouts. Scheduling. Real-time execution environments",
      "The web as a real-time system"
    ],
    githubrepo: "https://github.com/KennedySovine/CI646-Programming_Languages_Concurrency_and_ClientSideComputing",
  }
];

export const certifications = [
  {
    title: "CS50's Introduction to Computer Science",
    issuer: "CS50",
    duration: "Febuary 2023- No Expiry",
    credentialId: "e1a2f04e-d4b0-46b3-938c-059eeaa5ce1b",
    details: [
      "This certificate verifies the completion of CS50's Introduction to Computer Science course.",
      "It covers fundamental programming concepts, algorithms, data structures, and software engineering principles.",
      "The course is designed to provide a strong foundation in computer science and programming skills."
    ],
    tags: [""],
    icon: "certificate",
    verificationUrl: "https://certificates.cs50.io/e1a2f04e-d4b0-46b3-938c-059eeaa5ce1b.pdf?size=letter"
  },
  {
    title: "edX Verified Certificate for CS50's Introduction to Computer Science",
    issuer: "edX",
    duration: "Febuary 2023 - No Expiry",
    credentialId: "4a3490195128403ab3f27709f6c6ed08",
    details: [
      "This certificate verifies the completion of CS50's Introduction to Computer Science course on edX.",
      "It covers fundamental programming concepts, algorithms, data structures, and software engineering principles.",
      "The course is designed to provide a strong foundation in computer science and programming skills."
    ],
    tags: [""],
    icon: "gamepad",
    verificationUrl: "https://courses.edx.org/certificates/4a3490195128403ab3f27709f6c6ed08"
  },
  {
    title: "Learn React Course",
    issuer: "Codecademy",
    duration: "June 2025 - No Expiry",
    credentialId: "3BB1154C-B",
    details: [
      "This certificate verifies the completion of the Learn React course on Codecademy.",
      "It covers the fundamentals of React, including components, state management, and lifecycle methods.",
      "The course is designed to provide a solid understanding of building user interfaces with React."
    ],
    tags: ["React", "JavaScript", "Frontend Development"],
    icon: "./icons/React-icon.png",
    verificationUrl: "https://www.codecademy.com/profiles/KennedySofine/certificates/af00e5032d0a68cc84879983f5d8333b"
  }
];

export const education = [
  {
    title: "University of Brighton",
    duration: "September 2022 - Present",
    location: "Brighton, England",
    subtitle: "Bachelor of Science in Computer Science for Games",
    details: ["Activities and societies: Archery, eSports, GameJams,",
      "Course Representative 22-23",
    ],
    tags: [
      "Game Development",
      "Unity",
      "C#",
      "C++",
      "Java",
      "Object-Oriented Programming",
      "Software Engineering",
      "Game Design",
      "Game Prototyping",
    ],
    icon: "graduation-cap",
  },
  {
    title: "Pope John Paul II High School",
    duration: "August 2018 - May 2022",
    location: "Hendersonville, TN, USA",
    subtitle: "High School Diploma",
    details: [
      "Grade: 3.98/4 WeightedGrade: 3.98/4 Weighted",
      "Activities and societies: Math Team, Archery Team, Model UN, Youth in Government",
      "Honors: National Honor Society,",
    ],
    tags: [ "AP Computer Science A",
      "AP Calculus BC",
      "AP US History",
      "AP English Language and Composition",
      "AP Economics",
      "Model United Nations",
      "Youth in Government",
      "Archery Team",
    ],
    icon: "book",
  },
];

export const footer = [
{
  label: "Dev Profiles",
    data: [
      {
        text: "GitHub",
        link: "https://github.com/KennedySovine",
      },
     ],
},
  {
    label: "Resources",
     data: [
 {
 text: "Download CV",
 link: "./CV_KennedySovineATS.pdf",
 download: "Kennedy_Sovine_CV.pdf",
 },
 {
 text: "Enable Dark/Light Mode",
func: "enableDarkMode()",
 },
{
 text: "Print this page",
 func: "window.print()",
 },
 {
 text: "Clone this page",
link: "https://github.com/vinaysomawat/vinaysomawat.github.io",
 },
],
  },
  {
    label: "Links",
    data: [
      //   {
      //     text: "Linkedin",
      //     link: "https://www.linkedin.com/in/kennedy-sovine-975090199/",
      //   },
      //   {
      //     text: "Twitter",
      //     link: "https://twitter.com/thesigmakid",
      //   },
      {
        text: "Github",
        link: "https://github.com/kennedysovine/kennedysovine.github.io",
      },
    ],
  },
  {
    label: "copyright-text",
    data: ["Made with &hearts; by Vinay Somawat"],
  },
];

export const moduleGrades = [
  {
    module: "CI411 - Introduction to Games Programming",
    assignmentOne: "Portfolio",
    assignmentTwo: "Game",
    gradeOne: 68,
    gradeTwo: 58,
    finalGrade: 63,
  },
  {
    module: "CI410  - Introduction to Game Design and Development",
    assignmentOne: "Game Design",
    assignmentTwo: "Game Prototype",
    gradeOne: 71,
    gradeTwo: 42,
    finalGrade: 57,
  },
  {
    module: "CI435 - Introduction to Web Development",
    assignmentOne: "Coursework",
    assignmentTwo: "Examination",
    gradeOne: 63,
    gradeTwo: 81,
    finalGrade: 72,
  },
  {
    module: "CI474 - Introduction to 3D Modelling and Animation",
    assignmentOne: "Portfolio Task 1",
    assignmentTwo: "Portfolio Task 2",
    gradeOne: 71,
    gradeTwo: 68,
    finalGrade: 69,
  },
  {
    module: "CI465 - Working in the Digital and Games Industries",
    assignmentOne: "Group Project",
    assignmentTwo: "Individual Project",
    gradeOne: 67,
    gradeTwo: 58,
    finalGrade: 63,
  },
  {
    module: "CI413 - Game Level and Asset Design",
    assignmentOne: "Level design with original assets",
    assignmentTwo: "Group Report",
    gradeOne: 55,
    gradeTwo: 85,
    finalGrade: 67,
  },
  {
    module: "CI541 - Game Development Frameworks",
    assignmentOne: "3D game project",
    gradeOne: 68,
    finalGrade: 68,
  },
  {
    module: "CI587 - Web based game development",
    assignmentOne: "Game Development Project",
    gradeOne: 78,
    finalGrade: 78,
  },
  {
    module: "CI536 - Integrated Group Project",
    assignmentOne: "Group Project",
    gradeOne: 77,
    finalGrade: 77,
  },
  {
    module: "CI520 - Narrative Game Design",
    assignmentOne: "Game Concept and Prototype",
    gradeOne: 67,
    finalGrade: 67,
  },
  {
    module: "CI517 - Game Engine Fundamentals",
    assignmentOne: "Game Engine Components",
    gradeOne: 65,
    finalGrade: 65,
  },
  {
    module: "CI516 - Artificial Intelligence for Games",
    assignmentOne: "Game AI Prototype",
    assignmentTwo: "Game AI Report",
    gradeOne: 38,
    gradeTwo: 48,
    finalGrade: 42,
  },
];

export const projects = [
  {
    title: "Final Project - Balancing in MMOs Demo",
    description: "A demo project for the final year, focusing on balancing mechanics in Massively Multiplayer Online (MMO) games. The project explores various balancing techniques and their impact on gameplay, with research focused on League of Legends.",
    fullDescription: `
      <h3>Project Overview</h3>
      <p>A comprehensive research and development project examining game balance in MMOs, specifically analyzing Riot Games' approach to balancing League of Legends. The project includes both theoretical research and a practical demonstration.</p>
      
      <h3>Research Focus</h3>
      <ul>
        <li>Analysis of Riot Games' balancing methodology</li>
        <li>Player behavior and meta evolution</li>
        <li>Data-driven balance decisions</li>
      </ul>
      
      <h3>Demo Features</h3>
      <ul>
        <li>Interactive balance testing environment</li>
        <li>Real-time parameter adjustment</li>
        <li>Performance metrics and analytics</li>
      </ul>
      
      <h3>Technical Implementation</h3>
      <ul>
        <li>Unity Engine for demo development</li>
        <li>C# scripting for balance algorithms</li>
        <li>Statistical analysis integration</li>
      </ul>
      
      <h3>Academic Contribution</h3>
      <p>This project contributes to the understanding of game balance theory and provides practical tools for game developers to implement and test balance changes.</p>
    `,
    tags: ["Unity", "C#", "Game Design", "Research", "MMO", "Game Balance", "Data Analysis"],
    sourceCodeUrl: "https://github.com/KennedySovine/Final-Project",
    image: "https://via.placeholder.com/400x300/8577e6/ffffff?text=MMO+Balance+Demo",
    youtubeUrl: "https://youtu.be/VYK1bcIwPtE",
  },
  {
    title: "Crossing Roads - Integrated Group Project",
    description: "A collaborative project where team members worked together to create a game that simulates crossing roads, focusing on gameplay mechanics and user experience. The game focused on teaching players (mainly children) the different road crossings in the UK and how to cross them safely.",
    fullDescription: `
      <h3>Project Overview</h3>
      <p>An educational game designed to teach children about road safety and different types of road crossings in the UK. This collaborative project emphasized accessibility, usability, and educational value.</p>
      
      <h3>Key Features</h3>
      <ul>
        <li>Interactive road crossing scenarios</li>
        <li>Accessibility features for children with learning difficulties</li>
        <li>Dyslexic-friendly font implementation</li>
        <li>Simple, clear instructions and visual cues</li>
        <li>Progressive difficulty levels</li>
        <li>Safety-first game mechanics</li>
      </ul>
      
      <h3>Technical Implementation</h3>
      <ul>
        <li>Unity Engine for game development</li>
        <li>C# scripting for game logic</li>
        <li>User-centered design principles</li>
        <li>Agile development methodology</li>
        <li>Team collaboration and version control</li>
      </ul>

      <h3>My Role</h3>
      <p>In the team, I took on the role of the leader, delegating tasks to those in the group that I knew were most suited for the role. These roles included: </p>
      <ul>
        <li>2D Artist</li>
        <li>3D Artist</li>
        <li>Game Designer</li>
        <li>Game Developer</li>
        <li>UI/UX Designer</li>
      </ul>
      <p>In this project, I was responsible for the coding and implementation of the game mechanics, ensuring that the game was accessible and educational. I also contributed to the design of the user interface and the overall user experience.</p>
      <p>From sound mechanics to camera changes, I worked on various aspects of the game to ensure a smooth and engaging experience for players.</p>
    `,
    tags: ["Unity", "C#", "Game Design", "Education", "Accessibility", "Team Project"],
    sourceCodeUrl: "https://github.com/KennedySovine/Integrated-Group-Project",
    image: "https://via.placeholder.com/400x300/4169e1/ffffff?text=Road+Safety+Game",
    youtubeUrl: "https://youtu.be/rmytk9X6hKg",
  },
  {
    title: "Web Dev Suika Game",
    description: "A web-based game inspired by the Suika Game, developed using HTML, CSS, and JavaScript. The game features a unique gameplay mechanic where players combine fruits to create new items, aiming to achieve high scores.",
    fullDescription: `
      <h3>Project Overview</h3>
      <p>A web-based implementation of the popular Suika Game (Watermelon Game), developed as part of a web development for games project. This project demonstrates proficiency in frontend technologies and game development concepts.</p>
      
      <h3>Key Features</h3>
      <ul>
        <li>Physics-based fruit dropping mechanics</li>
        <li>Fruit combination system with scoring</li>
        <li>Responsive design for various screen sizes</li>
        <li>Clean, intuitive user interface</li>
        <li>High score tracking</li>
      </ul>
      
      <h3>Technical Implementation</h3>
      <ul>
        <li>Pure JavaScript for game logic and physics simulation</li>
        <li>HTML5 Canvas for rendering graphics</li>
        <li>CSS3 for styling and responsive layout</li>
        <li>Local storage for score persistence</li>
      </ul>
    `,
    tags: ["HTML", "CSS", "JavaScript", "Game Development", "Canvas"],
    sourceCodeUrl: "https://github.com/KennedySovine/Web-Dev-for-Games-Project",
    playableURL: "https://kennedysovine.github.io/Web-Dev-for-Games-Project/",
    image: "./IMAGES/ProjectPreviewImages/SUIKAGAMEPREVIEW.png",
    youtubeUrl: "", // Example YouTube link
  },
  {
    title: "Project: New World",
    description: "Group Project Visual Novel for CI520 - Narrative Game Design.",
    fullDescription: `
      <h3>Project Overview</h3>
      <p>A group project that combines narrative design with visual novel mechanics, focusing on storytelling and player choices. The project showcases the ability to create engaging narratives in a game format.</p>
      
      <h3>Key Features</h3>
      <ul>
        <li>Interactive storytelling with player choices</li>
        <li>Character development and dialogue systems</li>
        <li>Visual novel style graphics and animations</li>
      </ul>
      
      <h3>Technical Implementation</h3>
      <ul>
        <li>Ren'Py for development</li>
        <li>Python scripting for game logic</li>
        <li>Visual assets created using digital art tools</li>
      </ul>

      <p>Though the game was not fully visually completed, the narrative and gameplay mechanics were fully implemented, showcasing the ability to create engaging narratives in a game format.</p>
      <p>In this project, I was responsible for the coding and implementation of the game mechanics, ensuring that the narrative flowed smoothly and that player choices had meaningful impacts on the story.</p>
    `,
    tags: ["Ren'Py", "Python", "Game Design", "Narrative", "Visual Novel", "Team Project"],
    sourceCodeUrl: "https://github.com/KennedySovine/Project-new-world",
    playableURL: "https://kennedysovine.github.io/Project-new-world/",
    image: "./IMAGES/ProjectPreviewImages/NEWWORLDGAMEPREVIEW.png",
    youtubeUrl: "", // Example YouTube link
  },
];
