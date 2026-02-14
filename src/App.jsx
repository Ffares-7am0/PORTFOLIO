import { useState, useEffect, useRef } from 'react'
import emailjs from '@emailjs/browser'
import { FaWhatsapp, FaTelegram, FaLinkedin, FaGithub, FaPhone, FaCheck } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { db } from './firebase'
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, increment, deleteDoc } from 'firebase/firestore'
import { motion, AnimatePresence } from 'framer-motion'

const translations = {
    en: {
        nav: { hero: "Home", snapshot: "About", skills: "Skills", projects: "Projects", journey: "Journey", workflow: "Workflow", education: "Education", game: "Play", feedback: "Feedback", contact: "Contact" },
        hero: {
            name: "Fares Mohammed",
            tagline: "Computer Science Student | Junior Software Developer",
            sentence: "Passionate about building efficient, scalable software and solving complex problems with elegant code.",
            viewWork: "View Work",
            contact: "Contact"
        },
        snapshot: {
            title: "Engineering Snapshot",
            content: "Applying SOLID principles, OOP, and design thinking to build structured, maintainable desktop and web applications. Experienced team leader, thriving on problem solving, collaboration, and continuous improvement."
        },
        skills: {
            title: "Hard & Soft Skills",
            categories: [
                {
                    name: "Technical (Hard Skills)",
                    items: [
                        "OOP", "SOLID Principles", "Data Structures & Algorithms",
                        "Problem Solving & Logical Thinking", "Design Thinking",
                        "Desktop Dev (WPF, C#, Architecture, UI Logic, SQL Integration)",
                        "Web Dev (ASP.NET MVC, HTML5, CSS3, JS, MVC Architecture)",
                        "Database (Design, Normalization, Queries, CRUD)",
                        "C#", "JavaScript", "C++", "Clean Code & Debugging"
                    ]
                },
                {
                    name: "Professional (Soft Skills)",
                    items: [
                        "Team Leadership", "Working in a Team", "Working Under Pressure", "Time Management",
                        "Self-Learning", "Communication Skills", "Responsibility & Commitment",
                        "Analytical Thinking", "Continuous Learning", "Mentoring & Academic Support"
                    ]
                }
            ]
        },
        projects: {
            title: "Selected Projects",
            githubBtn: "View on GitHub",
            placeholder: "Project Preview Content",
            items: [
                {
                    id: "game-hub",
                    name: "Ultimate Game Hub",
                    tags: ["HTML5", "CSS3", "JavaScript", "Featured"],
                    desc: "A massive collection of 20-25 arcade and logic games built with pure web technologies. Focuses on game logic, performance, and user engagement.",
                    isFeatured: true,
                    image: ""
                },
                {
                    id: "hospital-wpf",
                    name: "Hospital Management (WPF)",
                    tags: ["C#", "WPF", "SQL Server", "Architecture"],
                    desc: "Full desktop application for managing patient records, doctors, and appointments with daily scheduling views.",
                    image: ""
                },
                {
                    id: "hospital-mvc",
                    name: "Hospital Management (MVC)",
                    tags: ["ASP.NET MVC", "C#", "Entity Framework", "Web"],
                    desc: "Web-based version of the hospital system using modern MVC architecture for scalability.",
                    image: ""
                },
                {
                    id: "inventory-wpf",
                    name: "Inventory System (WPF)",
                    tags: ["C#", "WPF", "CRUD", "Desktop"],
                    desc: "Comprehensive inventory tracking with full CRUD operations for items and project management elements.",
                    image: ""
                },
                {
                    id: "inventory-mvc",
                    name: "Inventory System (MVC)",
                    tags: ["ASP.NET MVC", "SQL Server", "Architecture"],
                    desc: "Cloud-ready inventory management system with robust database integration and user roles.",
                    image: ""
                },
                {
                    id: "ecommerce-wpf",
                    name: "E-Commerce Desktop",
                    tags: ["C#", "WPF", "UI/UX", "Desktop"],
                    desc: "A sleek desktop shopping platform featuring product catalogs and order processing logic.",
                    image: ""
                },
                {
                    id: "ecommerce-mvc",
                    name: "E-Commerce Web (MVC)",
                    tags: ["ASP.NET MVC", "Ecommerce", "EF Core"],
                    desc: "Business-ready web store with cart functionality and secure checkout simulations.",
                    image: ""
                },
                {
                    id: "ecommerce-vanilla",
                    name: "E-Commerce Frontend",
                    tags: ["HTML", "CSS", "JS", "UI/UX"],
                    desc: "Direct and responsive web interface for shopping, focusing on clean coding and smooth animations.",
                    image: ""
                }
            ]
        },
        journey: {
            title: "Participations & Achievements",
            items: [
                { id: 1, title: "Joined PHP Teams at Fathalla Tech School", desc: "Joined as an ambassador for Fathalla School, representing the institution and providing academic support to peers in core and specialized subjects." },
                { id: 2, title: "Organizing ISEF Competition", desc: "Volunteered to organize and manage the local ISEF competition at Fathalla International Applied Technology School." },
                { id: 3, title: "Neel Al-Amal Hospital Visit", desc: "Coordinated a school visit to Neel Al-Amal Hospital for congenital differences, distributing gifts to children and learning about the hospital's specialized care." },
                { id: 4, title: "Fundraising for Neel Al-Amal", desc: "Volunteered during the holy month of Ramadan to collect donations at Fathalla Market (Smouha branch), receiving a certificate of appreciation from the hospital." },
                { id: 5, title: "Passed Desktop & Web Application Exams", desc: "Successfully cleared both Desktop and Web Application professional examinations from the first attempt." },
                { id: 6, title: "Passed Tech Fundaments Exams", desc: "Passed examinations in Logic Circuits, Hardware, and Wireframe UI/UX design on the first attempt." },
                { id: 7, title: "Core Programming Certifications", desc: "Successfully completed examinations for STL (C++), C++, C#, and the full Web frontend stack (HTML, CSS, JS)." },
                { id: 8, title: "1st Place - Capstone Competition", desc: "Won first place in the annual Capstone graduation project with 'Rewards Cards'. Developed skills in team collaboration and high-pressure execution." },
                { id: 9, title: "IT Summer Internship", desc: "Completed practical summer training within the IT department of Fathalla Market corporate office." },
                { id: 11, title: "New Batch Recruitment Org", desc: "Organized the recruitment camp, interviews, and entrance exams for the new batch of Fathalla School students." },
                { id: 12, title: "Reception Leader - Art Shift", desc: "Served as the Reception Team Leader for the Art Shift initiative, dedicated to children's creativity and art education." },
                { id: 13, title: "Hospital Visits - Art Shift", desc: "Conducted two follow-up visits to Neel Al-Amal Hospital as part of the Art Shift initiative team." },
                { id: 14, title: "Triple Leadership Role", desc: "Promoted to PHP Team Leader, while also serving as a Mediator for conflict resolution and a Vocational Support leader providing courses to peers." },
                { id: 15, title: "ISEF Organizing Leader", desc: "Led the organizational team for the ISEF competition at Fathalla Tech School." },
                { id: 16, title: "Fathalla Market Sports Festival", desc: "Volunteered as a lead organizer for the Fathalla Market Sports Festival, receiving a commemorative medal for excellence in organization." }
            ]
        },
        workflow: {
            title: "How I Work",
            steps: [
                { title: "Understanding Users", desc: "Most projects start with understanding the user. I gather and analyze user input to clearly define requirements and real user needs." },
                { title: "System Architecture", desc: "Based on that, I design the system structure through ERD and database schema modeling to ensure clarity, scalability, and maintainability." },
                { title: "WPF Workflow", desc: "For WPF applications, I begin with database creation, configuration, and data integration before moving to UI design and coding." },
                { title: "ASP.NET MVC Workflow", desc: "For ASP.NET MVC projects, I follow the same structured approach, while implementing the database after the system architecture is clearly defined." },
                { title: "UI Implementation", desc: "UI designs are first created on Figma, then translated into clean, well-organized code page by page." },
                { title: "Team Collaboration", desc: "When working within a team, tasks are divided across design, development, and data handling, with full alignment and understanding of each member’s role." },
                { title: "Problem Solving", desc: "When challenges arise, I return to available data, discuss collaboratively, and research trusted resources like GeeksforGeeks/W3Schools, or responsibly leverage AI to stay modern." }
            ]
        },
        education: {
            title: "Education",
            school: "Fathallah International Applied Technology School",
            specialization: "Computer Science",
            period: "2024 – Expected Graduation: 2027",
            grades: [
                {
                    year: "Year 1",
                    subjects: [
                        "Operating Systems",
                        "Operating Different Equipment and Devices",
                        "Logic Circuits",
                        "Designing Simple User Interfaces (Wireframing)",
                        "Using Different Software Applications",
                        "Developing Simple Programs using C++",
                        "Testing and Debugging Simple Programs",
                        "Advanced Programming using C# (OOP)"
                    ]
                },
                {
                    year: "Year 2",
                    subjects: [
                        "Building Databases using SQL Server",
                        "Web Applications Development (ASP.NET MVC)",
                        "Problem Solving Techniques",
                        "Desktop Applications Development (C# & WPF)"
                    ]
                },
                {
                    year: "Year 3",
                    subjects: [
                        "Mobile Application Development",
                        "Firmware Programming for Embedded Systems",
                        "Internet of Things (IoT) Applications Development",
                        "Multimedia Processing Algorithms",
                        "Modifying and Contributing to Programming Projects",
                        "APIs Design and Programming"
                    ]
                }
            ]
        },
        feedback: {
            title: "Constructive Feedback",
            intro: "Your opinion matters. Help me improve by sharing your constructive criticism or suggestions.",
            form: {
                name: "Your Name",
                email: "Your Email (Will not be published)",
                message: "Your Feedback...",
                submit: "Submit Feedback",
                submitting: "Sending...",
                success: "Thank you! Your feedback has been sent successfully."
            }
        },
        contact: {
            title: "Contact Me",
            subtitle: "Let's work together!",
            getInTouch: "Get in Touch",
            name: "Your Name",
            email: "Your Email",
            message: "Your Message",
            send: "Send Message",
            sending: "Sending...",
            success: "Message sent successfully! I'll get back to you soon.",
            whatsapp: "01203927960",
            whatsappUrl: "https://wa.me/201203927960?text=Hello%20Fares,%20I%20would%20like%20to%20discuss%20a%20project!",
            telegram: "01203927960",
            telegramUrl: "https://t.me/+201203927960",
            github: "FaresMohammedDev",
            githubUrl: "https://github.com/FaresMohammedDev",
            linkedin: "Fares Mohammed",
            linkedinUrl: "https://www.linkedin.com/in/fares-mohammed-51a8a03a9",
            emailLabel: "fares.mohammed.dev@gmail.com",
            copied: "Copied!"
        },
        puzzleWin: {
            title: "Congratulations! You Won!",
            subtitle: "Enter your details and wait for our message on your email...",
            name: "Your Name",
            email: "Your Email",
            message: "Optional Message",
            submit: "Submit",
            playAgain: "Play Again?",
            resetBtn: "Reset Game",
            thanks: "Thank you! Wait for our message on your email.",
            invalidEmail: "Please enter a valid email address."
        },
        adminWinners: {
            title: "Game Winners",
            noWinners: "No winners yet."
        },
        footer: "© 2026 Fares Mohammed. All rights reserved."
    },
    ar: {
        nav: { hero: "الرئيسية", snapshot: "عني", skills: "المهارات", projects: "المشاريع", journey: "الرحلة", workflow: "منهجية العمل", education: "التعليم", game: "لعبة", feedback: "رأيك", contact: "تواصل" },
        hero: {
            name: "فارس محمد",
            tagline: "طالب علوم حاسب | مطور برمجيات جونيور",
            sentence: "شغوف ببناء برمجيات فعالة وقابلة للتوسع وحل المشكلات المعقدة بكود أنيق.",
            viewWork: "شاهد أعمالي",
            contact: "تواصل معي"
        },
        snapshot: {
            title: "نظرة برمجية",
            content: "أطبق مبادئ SOLID وOOP وفكر Design Thinking لبناء تطبيقات دسكتوب وويب منظمة وسهلة الصيانة. قائد فريق عندي خبرة، وأزدهر في حل المشاكل، التعاون مع الفريق، وتطوير نفسي باستمرار."
        },
        skills: {
            title: "المهارات التقنية والشخصية",
            categories: [
                {
                    name: "مهارات تقنية (Hard Skills)",
                    items: [
                        "البرمجة كائنية التوجه (OOP)", "مبادئ SOLID", "هياكل البيانات والخوارزميات",
                        "حل المشكلات والتفكير المنطقي", "فكر Design Thinking",
                        "تطوير الديسكتوب (WPF, C#, Architecture, UI Logic, SQL Integration)",
                        "تطوير الويب (ASP.NET MVC, HTML5, CSS3, JS, MVC Architecture)",
                        "تصميم وقواعد البيانات (Normalization, Queries, CRUD)",
                        "C#", "JavaScript", "C++", "Clean Code وتصحيح الأخطاء"
                    ]
                },
                {
                    name: "مهارات شخصية (Soft Skills)",
                    items: [
                        "قيادة الفريق", "العمل الجماعي", "العمل تحت ضغط", "إدارة الوقت",
                        "التعلم الذاتي", "مهارات التواصل", "المسؤولية والالتزام",
                        "التفكير التحليلي", "التعلم المستمر", "التوجيه والدعم الأكاديمي"
                    ]
                }
            ]
        },
        projects: {
            title: "مشاريع مختارة",
            githubBtn: "مشاهدة على GitHub",
            placeholder: "معاينة المشروع",
            items: [
                {
                    id: "game-hub",
                    name: "Ultimate Game Hub",
                    tags: ["HTML5", "CSS3", "JavaScript", "Featured"],
                    desc: "مجموعة ضخمة من 20-25 لعبة أركيد وتفكير منطقي، مبنية بالكامل بتقنيات الويب. تركز على منطق الألعاب، الأداء، وتجربة المستخدم المميزة.",
                    isFeatured: true,
                    image: ""
                },
                {
                    id: "hospital-wpf",
                    name: "نظام إدارة المستشفيات (WPF)",
                    tags: ["C#", "WPF", "SQL Server", "Architecture"],
                    desc: "تطبيق ديسكتوب كامل لإدارة سجلات المرضى والأطباء والمواعيد، مع عرض الجداول اليومية بشكل منظم.",
                    image: ""
                },
                {
                    id: "hospital-mvc",
                    name: "نظام إدارة المستشفيات (Web MVC)",
                    tags: ["ASP.NET MVC", "C#", "Entity Framework", "Web"],
                    desc: "نسخة الويب من نظام المستشفى باستخدام معمارية MVC الحديثة لضمان القابلية للتوسع.",
                    image: ""
                },
                {
                    id: "inventory-wpf",
                    name: "نظام إدارة المخازن (WPF)",
                    tags: ["C#", "WPF", "CRUD", "Desktop"],
                    desc: "تطبيق شامل لتتبع المخزون مع عمليات CRUD كاملة للعناصر وعناصر إدارة المشاريع.",
                    image: ""
                },
                {
                    id: "inventory-mvc",
                    name: "نظام إدارة المخازن (Web MVC)",
                    tags: ["ASP.NET MVC", "SQL Server", "Architecture"],
                    desc: "نظام إدارة مخازن جاهز للسحابة مع تكامل قوي لقواعد البيانات وإدارة أدوار المستخدمين.",
                    image: ""
                },
                {
                    id: "ecommerce-wpf",
                    name: "منصة تجارة إلكترونية (Desktop)",
                    tags: ["C#", "WPF", "UI/UX", "Desktop"],
                    desc: "منصة تسوق ديسكتوب أنيقة تتضمن كتالوجات المنتجات ومنطق معالجة الطلبات.",
                    image: ""
                },
                {
                    id: "ecommerce-mvc",
                    name: "متجر إلكتروني (Web MVC)",
                    tags: ["ASP.NET MVC", "Ecommerce", "EF Core"],
                    desc: "متجر ويب متكامل مع وظائف عربة التسوق ومحاكاة عمليات الدفع الآمنة.",
                    image: ""
                },
                {
                    id: "ecommerce-vanilla",
                    name: "واجهة متجر إلكتروني",
                    tags: ["HTML", "CSS", "JS", "UI/UX"],
                    desc: "واجهة ويب سريعة الاستجابة للتسوق، تركز على نظافة الكود والأنيميشن الانسيابي.",
                    image: ""
                }
            ]
        },
        journey: {
            title: "مشاركات وإنجازات",
            items: [
                { id: 1, title: "انضمام لفرق PHP بمدرسة فتح الله", desc: "انضممت كسفير للمدرسة والتعريف بها، وكداعم دراسي لزملائي في المواد الأكاديمية والتخصصية." },
                { id: 2, title: "تنظيم مسابقة ISEF", desc: "تطوعت لتنظيم وإدارة مسابقة ISEF في مدرسة فتح الله الدولية للتكنولوجيا التطبيقية." },
                { id: 3, title: "زيارة مستشفى نيل الأمل", desc: "زيارة تبع مدرسة فتح الله لتوزيع هدايا على الأطفال في مستشفى نيل الأمل للاختلافات الخلقية والتعرف على خدمات المستشفى." },
                { id: 4, title: "جمع تبرعات لمستشفى نيل الأمل", desc: "تطوعت لجمع التبرعات في فتح الله ماركت (فرع سموحة) خلال شهر رمضان والحصول على شهادة تقدير." },
                { id: 5, title: "اجتياز امتحانات تطبيقات الديسكتوب والويب", desc: "النجاح في امتحانات الـ Desktop Application والـ Web Application من المحاولة الأولى." },
                { id: 6, title: "اجتياز امتحانات هندسة الحاسب", desc: "اجتياز امتحانات Logic Circuits و Hardware و Wireframe UI/UX من المحاولة الأولى." },
                { id: 7, title: "اجتياز امتحانات لغات البرمجة", desc: "اجتياز امتحانات STL و C++ و C# و HTML, CSS, JS بنجاح." },
                { id: 8, title: "المركز الأول في مسابقة الكابستون", desc: "الفوز بالمركز الأول بمشروع التخرج (Rewards Cards) وتعلم العمل الجماعي تحت الضغط." },
                { id: 9, title: "تدريب صيفي IT", desc: "إتمام التدريب الصيفي في قسم تكنولوجيا المعلومات (IT) في المقر الرئيسي لفتح الله ماركت." },
                { id: 11, title: "تنظيم قبول الدفعات الجديدة", desc: "تنظيم معسكر واختبارات القبول والمقابلات الشخصية للدفعة الجديدة بالمدرسة." },
                { id: 12, title: "ليدر استقبال في مبادرة Art Shift", desc: "أصبحت ليدر فريق الاستقبال في مبادرة Art Shift المخصصة لتنمية مهارات الأطفال الفنية." },
                { id: 13, title: "زيارات مستشفى نيل الأمل (Art Shift)", desc: "المشاركة في زيارتين لمستشفى نيل الأمل مع فريق مبادرة Art Shift." },
                { id: 14, title: "أدوار قيادية وتطويرية", desc: "أصبحت ليدر تيم PHP، ومنضماً لفريق الوساطة لحل الخلافات، والداعم المهني لتوفير الكورسات للزملاء." },
                { id: 15, title: "ليدر تنظيم ISEF", desc: "قيادة فريق تنظيم مسابقة ISEF داخل مدرسة فتح الله للتكنولوجيا." },
                { id: 16, title: "الحفل الرياضي لفتح الله ماركت", desc: "المشاركة كليدر في تنظيم الحفل الرياضي السنوي والحصول على ميدالية التميز التنظيمي." }
            ]
        },
        workflow: {
            title: "كيف أعمل؟",
            steps: [
                { title: "فهم المستخدم", desc: "تبدأ معظم مشاريعي بفهم المستخدم واحتياجاته. أقوم بجمع وتحليل بيانات المستخدم لتحديد المتطلبات الفعلية بشكل واضح ودقيق." },
                { title: "تصميم هيكل النظام", desc: "أعمل على تصميم هيكل النظام باستخدام ERD وDatabase Schema لضمان الوضوح وقابلية التوسع وسهولة الصيانة." },
                { title: "منهجية WPF", desc: "في تطبيقات WPF، أبدأ بإنشاء قاعدة البيانات، وضبط الإعدادات، وربط البيانات قبل الانتقال إلى تصميم الواجهة وكتابة الكود." },
                { title: "منهجية ASP.NET MVC", desc: "أتبّع نفس المنهجية المنظمة، مع تأجيل تنفيذ قاعدة البيانات إلى ما بعد وضوح هيكل النظام بالكامل." },
                { title: "تنفيذ الواجهات", desc: "يتم تصميم الواجهات أولًا باستخدام Figma، ثم تحويلها إلى كود منظم ونظيف صفحة بصفحة." },
                { title: "العمل الجماعي", desc: "عند العمل ضمن فريق، يتم توزيع المهام مع وجود فهم كامل لدور كل فرد داخل الفريق لضمان سلاسة التنفيذ." },
                { title: "مواجهة التحديات", desc: "أناقش الحلول مع الفريق، وأبحث في مصادر موثوقة (GeeksforGeeks/W3Schools)، وأستخدم الذكاء الاصطناعي بوعي لمواكبة التطورات." }
            ]
        },
        education: {
            title: "التعليم",
            school: "مدرسة فتح الله الدولية للتكنولوجيا التطبيقية",
            specialization: "تخصص علوم الحاسب",
            period: "2024 – سنة التخرج المتوقعة: 2027",
            grades: [
                {
                    year: "الصف الأول",
                    subjects: [
                        "نظم التشغيل",
                        "تشغيل الأجهزة والمعدات المختلفة",
                        "الدوائر المنطقية",
                        "تصميم واجهات مستخدم بسيطة (Wireframe)",
                        "استخدام تطبيقات برمجية متنوعة",
                        "تطوير برامج بسيطة باستخدام C++",
                        "اختبار وتصحيح البرامج",
                        "البرمجة المتقدمة باستخدام C# (OOP)"
                    ]
                },
                {
                    year: "الصف الثاني",
                    subjects: [
                        "بناء قواعد البيانات باستخدام SQL Server",
                        "تطوير تطبيقات الويب باستخدام ASP.NET MVC",
                        "حل المشكلات البرمجية",
                        "تطوير تطبيقات سطح المكتب باستخدام C# وWPF"
                    ]
                },
                {
                    year: "الصف الثالث",
                    subjects: [
                        "تطوير تطبيقات الهواتف المحمولة",
                        "برمجة الـ Firmware للأنظمة المدمجة",
                        "تطوير تطبيقات إنترنت الأشياء (IoT)",
                        "بناء خوارزميات معالجة الوسائط المتعددة",
                        "التعديل والمساهمة في المشاريع البرمجية",
                        "تصميم وبرمجة واجهات برمجة التطبيقات (APIs)"
                    ]
                }
            ]
        },
        feedback: {
            title: "آراؤكم البناءة",
            intro: "رأيك يهمني. ساعدني أتطور بمشاركة نقدك البناء أو اقتراحاتك.",
            form: {
                name: "اسمك",
                email: "بريدك الإلكتروني (لن يتم نشره)",
                message: "رأيك...",
                submit: "إرسال الرأي",
                submitting: "جاري الإرسال...",
                success: "شكراً لك! تم إرسال رأيك بنجاح."
            }
        },
        contact: {
            title: "تواصل معي",
            subtitle: "لنعمل معاً!",
            getInTouch: "تواصل معي",
            name: "اسمك",
            email: "بريدك الإلكتروني",
            message: "رسالتك",
            send: "إرسال الرسالة",
            sending: "جاري الإرسال...",
            success: "تم إرسال الرسالة بنجاح! سأرد عليك قريباً.",
            whatsapp: "01203927960",
            whatsappUrl: "https://wa.me/201203927960?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%20%D9%81%D8%A7%D8%B1%D8%B3%D8%8C%20%D8%A3%D9%88%D8%AF%20%D9%85%D9%86%D8%A7%D9%82%D8%B4%D8%A9%20%D9%85%D8%B4%D8%B1%D9%88%D8%B9%20%D9%85%D8%B9%D9%83!",
            telegram: "01203927960",
            telegramUrl: "https://t.me/+201203927960",
            github: "FaresMohammedDev",
            githubUrl: "https://github.com/FaresMohammedDev",
            linkedin: "Fares Mohammed",
            linkedinUrl: "https://www.linkedin.com/in/fares-mohammed-51a8a03a9",
            emailLabel: "fares.mohammed.dev@gmail.com",
            copied: "تم النسخ!"
        },
        puzzleWin: {
            title: "مبروك كسبت!",
            subtitle: "دخل بياناتك وانتظر رسالتنا على إيميلك...",
            name: "اسمك",
            email: "بريدك الإلكتروني",
            message: "رسالة اختيارية",
            submit: "إرسال",
            playAgain: "تلعب تاني؟",
            resetBtn: "لغبط",
            thanks: "شكراً لك! انتظر رسالتنا على إيميلك.",
            invalidEmail: "من فضلك أدخل بريد إلكتروني صحيح."
        },
        adminWinners: {
            title: "الفائزين باللعبة",
            noWinners: "لا يوجد فائزين بعد."
        },
        footer: "© 2026 فارس محمد. جميع الحقوق محفوظة."
    }
}

function App() {
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'en')
    const [activeSection, setActiveSection] = useState('hero')

    // Session tracking for feedback visibility
    const [sessionId] = useState(() => {
        let id = localStorage.getItem('portfolio_session_id')
        if (!id) {
            id = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
            localStorage.setItem('portfolio_session_id', id)
        }
        return id
    })

    // Feedback Logic
    const [feedbackList, setFeedbackList] = useState([])
    const [feedbackForm, setFeedbackForm] = useState({ name: '', email: '', message: '' })
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)
    const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false)
    const [showPhoneCopied, setShowPhoneCopied] = useState(false)
    const [activeSkillCategory, setActiveSkillCategory] = useState(0)
    const [focusedInput, setFocusedInput] = useState(null)
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })

    const updateCursorPos = (e) => {
        const input = e.target
        const rect = input.getBoundingClientRect()

        // Crtate a mirror div to measure caret position
        const mirror = document.createElement('div')
        const style = window.getComputedStyle(input)

        Array.from(style).forEach((prop) => {
            mirror.style[prop] = style.getPropertyValue(prop)
        })

        mirror.style.position = 'absolute'
        mirror.style.visibility = 'hidden'
        mirror.style.whiteSpace = 'pre-wrap'
        mirror.style.wordWrap = 'break-word'
        mirror.style.top = '0'
        mirror.style.left = '0'

        // Copy content up to caret
        const text = input.value.substring(0, input.selectionStart)
        mirror.textContent = text

        const span = document.createElement('span')
        span.textContent = '|'
        mirror.appendChild(span)

        document.body.appendChild(mirror)

        // Calculate relative position (percentage 0-100)
        // Correct for scroll position
        const scrollTop = input.scrollTop
        const scrollLeft = input.scrollLeft

        const x = Math.min(100, Math.max(0, ((span.offsetLeft - scrollLeft) / input.clientWidth) * 100))
        const y = Math.min(100, Math.max(0, ((span.offsetTop - scrollTop) / input.clientHeight) * 100))

        setCursorPos({ x, y })

        document.body.removeChild(mirror)
    }

    // Game Winners Logic
    const [gameWinnersList, setGameWinnersList] = useState([])

    // Contact Form Logic
    const [contactList, setContactList] = useState([])
    const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
    const [isSubmittingContact, setIsSubmittingContact] = useState(false)
    const [hasSubmittedContact, setHasSubmittedContact] = useState(false)

    const handleContactSubmit = (e) => {
        e.preventDefault()
        setIsSubmittingContact(true)

        // Replace these with your actual EmailJS credentials
        // Sign up at https://www.emailjs.com/
        const serviceID = 'YOUR_SERVICE_ID'
        const templateID = 'YOUR_TEMPLATE_ID'
        const publicKey = 'YOUR_PUBLIC_KEY'

        if (serviceID === 'YOUR_SERVICE_ID') {
            alert('Please configure EmailJS credentials in App.jsx to send emails.')
            setIsSubmittingContact(false)
            return
        }

        emailjs.send(serviceID, templateID, {
            from_name: contactForm.name,
            from_email: contactForm.email,
            message: contactForm.message,
            to_name: 'Fares Mohammed'
        }, publicKey)
            .then(() => {
                setIsSubmittingContact(false)
                setHasSubmittedContact(true)
                setContactForm({ name: '', email: '', message: '' })
                setTimeout(() => setHasSubmittedContact(false), 5000)
                alert(t.contact.success)
            }, (error) => {
                console.error('FAILED...', error.text)
                setIsSubmittingContact(false)
                alert('Failed to send message: ' + error.text)
            })
    }

    // Admin & Like Logic
    const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('portfolio_is_admin') === 'true')
    const [likedComments, setLikedComments] = useState(() => {
        const saved = localStorage.getItem('portfolio_liked_comments')
        return saved ? JSON.parse(saved) : []
    })
    const [adminClickCount, setAdminClickCount] = useState(0)

    useEffect(() => {
        localStorage.setItem('portfolio_is_admin', isAdmin)
    }, [isAdmin])

    useEffect(() => {
        localStorage.setItem('portfolio_liked_comments', JSON.stringify(likedComments))
    }, [likedComments])

    // Secret Admin Toggle (5 clicks on empty tile)
    const handleAdminToggle = () => {
        const newCount = adminClickCount + 1
        setAdminClickCount(newCount)

        if (newCount >= 5) {
            setAdminClickCount(0)
            if (isAdmin) {
                setIsAdmin(false)
            } else {
                const password = prompt("Enter Admin Password:")
                if (password === "122008") {
                    setIsAdmin(true)
                } else {
                    alert("Incorrect Password!")
                }
            }
        }

        // Reset counter if too slow (1 second)
        setTimeout(() => setAdminClickCount(0), 1000)
    }

    // Real-time listener for feedback
    useEffect(() => {
        // Temporarily removed orderBy to rule out missing index issues
        const q = query(collection(db, "feedback"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const feedbackData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Sort manually on client side to avoid index requirement
            // Sort: Starred first, then by timestamp descending
            feedbackData.sort((a, b) => {
                const starA = a.isStarred ? 1 : 0;
                const starB = b.isStarred ? 1 : 0;
                if (starA !== starB) return starB - starA; // Starred first
                return (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0);
            });
            setFeedbackList(feedbackData);
        }, (error) => {
            console.error("Error fetching feedback: ", error);
            alert("Error connecting to database: " + error.message);
        });

        return () => unsubscribe();
    }, []);

    // Real-time listener for game winners
    useEffect(() => {
        const q = query(collection(db, "gameWinners"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const winnersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Sort by timestamp descending
            winnersData.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
            setGameWinnersList(winnersData);
        }, (error) => {
            console.error("Error fetching game winners: ", error);
        });

        return () => unsubscribe();
    }, []);

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault()
        setIsSubmittingFeedback(true)

        // EmailJS Configuration
        const serviceID = 'YOUR_SERVICE_ID'
        const templateID = 'YOUR_TEMPLATE_ID' // You can use a different template or the same one
        const publicKey = 'YOUR_PUBLIC_KEY'

        // Send Email Notification
        if (serviceID !== 'YOUR_SERVICE_ID') {
            emailjs.send(serviceID, templateID, {
                from_name: feedbackForm.name,
                from_email: feedbackForm.email,
                message: `[FEEDBACK] ${feedbackForm.message}`,
                to_name: 'Fares Mohammed'
            }, publicKey)
                .then(() => console.log("Feedback email sent"))
                .catch((err) => console.error("Failed to send feedback email", err))
        }

        try {
            await addDoc(collection(db, "feedback"), {
                name: feedbackForm.name,
                email: feedbackForm.email,
                message: feedbackForm.message,
                likes: 0,
                approved: false, // Moderation: Pending by default
                sessionId: sessionId, // Track user's session
                date: new Date().toISOString().split('T')[0],
                timestamp: serverTimestamp()
            });

            setIsSubmittingFeedback(false)
            setHasSubmittedFeedback(true)
            setFeedbackForm({ name: '', email: '', message: '' })

            // Reset success message after 3 seconds
            setTimeout(() => setHasSubmittedFeedback(false), 5000)

            // Show alert to user
            alert("Thank you! Your feedback has been submitted for approval.")
        } catch (error) {
            console.error("Error adding feedback: ", error);
            setIsSubmittingFeedback(false);
            alert("Failed to send: " + error.message);
        }
    }

    const handleUpvote = async (id) => {
        if (!isAdmin && likedComments.includes(id)) {
            // alert("You've already liked this comment!") 
            return // Silent return for better UX
        }

        const feedbackRef = doc(db, "feedback", id);
        try {
            await updateDoc(feedbackRef, {
                likes: increment(1)
            });

            if (!isAdmin) {
                setLikedComments([...likedComments, id])
            }
        } catch (error) {
            console.error("Error updating likes: ", error);
        }
    }

    const handleApprove = async (id) => {
        if (!isAdmin) return

        try {
            await updateDoc(doc(db, "feedback", id), {
                approved: true
            })
        } catch (error) {
            console.error("Error approving feedback: ", error);
            alert("Failed to approve: " + error.message)
        }
    }

    const handleStar = async (id, currentStatus) => {
        if (!isAdmin) return

        try {
            await updateDoc(doc(db, "feedback", id), {
                isStarred: !currentStatus
            })
        } catch (error) {
            console.error("Error starring feedback: ", error);
            alert("Failed to star: " + error.message)
        }
    }

    const handleDelete = async (id) => {
        if (!isAdmin) return

        if (window.confirm("Are you sure you want to delete this feedback?")) {
            try {
                await deleteDoc(doc(db, "feedback", id))
            } catch (error) {
                console.error("Error deleting feedback: ", error);
                alert("Failed to delete: " + error.message)
            }
        }
    }

    const handleDeleteWinner = async (id) => {
        if (!isAdmin) return

        if (window.confirm("Are you sure you want to delete this winner entry?")) {
            try {
                await deleteDoc(doc(db, "gameWinners", id))
            } catch (error) {
                console.error("Error deleting winner: ", error);
                alert("Failed to delete: " + error.message)
            }
        }
    }

    // 15 Puzzle Game Logic
    const [puzzle, setPuzzle] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0])
    const [isGameWon, setIsGameWon] = useState(false)
    const [winnerData, setWinnerData] = useState({ name: '', email: '', message: '' })
    const [isWinnerSubmitting, setIsWinnerSubmitting] = useState(false)
    const [hasWinnerSubmitted, setHasWinnerSubmitted] = useState(false)

    const t = translations[lang]
    const githubUrl = "https://github.com/FaresMohammedDev"
    const journeyRef = useRef(null)

    useEffect(() => {
        document.documentElement.setAttribute('lang', lang)
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
        localStorage.setItem('lang', lang)
    }, [lang])

    // Initial Shuffle
    useEffect(() => {
        if (isAdmin) {
            // Admin sees solved puzzle
            setPuzzle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0])
            setIsGameWon(false) // Not in "won" state, just solved
        } else {
            shufflePuzzle()
        }
    }, [isAdmin])

    const shufflePuzzle = () => {
        let newPuzzle = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0]

        // Shuffle by making random valid moves (this guarantees solvability)
        for (let i = 0; i < 200; i++) {
            const emptyIndex = newPuzzle.indexOf(0)
            const possibleMoves = []
            const row = Math.floor(emptyIndex / 4)
            const col = emptyIndex % 4

            if (row > 0) possibleMoves.push(emptyIndex - 4)
            if (row < 3) possibleMoves.push(emptyIndex + 4)
            if (col > 0) possibleMoves.push(emptyIndex - 1)
            if (col < 3) possibleMoves.push(emptyIndex + 1)

            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
            const temp = newPuzzle[emptyIndex]
            newPuzzle[emptyIndex] = newPuzzle[randomMove]
            newPuzzle[randomMove] = temp
        }

        setPuzzle(newPuzzle)
        setIsGameWon(false)
        setHasWinnerSubmitted(false)
        setWinnerData({ name: '', email: '', message: '' })
    }

    const handleWinnerSubmit = async (e) => {
        e.preventDefault()

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(winnerData.email)) {
            alert(t.puzzleWin.invalidEmail)
            return
        }

        setIsWinnerSubmitting(true)

        // EmailJS Configuration
        const serviceID = 'YOUR_SERVICE_ID'
        const templateID = 'YOUR_TEMPLATE_ID'
        const publicKey = 'YOUR_PUBLIC_KEY'

        // Send Email Notification
        if (serviceID !== 'YOUR_SERVICE_ID') {
            emailjs.send(serviceID, templateID, {
                from_name: winnerData.name,
                from_email: winnerData.email,
                message: `[GAME WINNER] ${winnerData.message || 'No message'}`,
                to_name: 'Fares Mohammed'
            }, publicKey)
                .then(() => console.log("Winner email sent"))
                .catch((err) => console.error("Failed to send winner email", err))
        }

        try {
            await addDoc(collection(db, "gameWinners"), {
                name: winnerData.name,
                email: winnerData.email,
                message: winnerData.message || '', // Optional message
                date: new Date().toISOString().split('T')[0],
                timestamp: serverTimestamp()
            });

            setIsWinnerSubmitting(false)
            setHasWinnerSubmitted(true)
        } catch (error) {
            console.error("Error saving winner: ", error);
            setIsWinnerSubmitting(false);
            alert("Failed to save: " + error.message);
        }
    }

    const moveTile = (index) => {
        if (isGameWon) return
        const emptyIndex = puzzle.indexOf(0)
        const row = Math.floor(index / 4)
        const col = index % 4
        const emptyRow = Math.floor(emptyIndex / 4)
        const emptyCol = emptyIndex % 4

        const isAdjacent = Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1
        if (isAdjacent) {
            const newPuzzle = [...puzzle]
            newPuzzle[emptyIndex] = puzzle[index]
            newPuzzle[index] = 0
            setPuzzle(newPuzzle)

            const solved = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0]
            if (newPuzzle.every((val, i) => val === solved[i])) {
                setIsGameWon(true)
            }
        }
    }

    // Custom Cursor Logic
    useEffect(() => {
        const cursor = document.getElementById('custom-cursor')
        const cursorBlur = document.getElementById('cursor-blur')

        const moveCursor = (e) => {
            const x = e.clientX
            const y = e.clientY
            if (cursor) {
                cursor.style.left = `${x}px`
                cursor.style.top = `${y}px`
            }
            if (cursorBlur) {
                cursorBlur.animate({
                    left: `${x}px`,
                    top: `${y}px`
                }, { duration: 500, fill: "forwards" })
            }
        }

        window.addEventListener('mousemove', moveCursor)
        return () => window.removeEventListener('mousemove', moveCursor)
    }, [])

    // Intersection Observer for transitions
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible')
                    setActiveSection(entry.target.id)
                }
            })
        }, { threshold: 0.2 })

        const sections = document.querySelectorAll('.transition-section')
        sections.forEach(section => observer.observe(section))
        return () => sections.forEach(section => observer.unobserve(section))
    }, [])

    const handleNavClick = (e, sectionId) => {
        e.preventDefault()
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const scrollJourney = (direction) => {
        if (journeyRef.current) {
            const scrollAmount = 450
            journeyRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    return (
        <div id="app">
            <div id="custom-cursor"></div>
            <div id="cursor-blur"></div>
            <div className="bg-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <nav id="navbar">
                <div className="nav-container">
                    <div
                        className="logo"
                        onClick={handleAdminToggle}
                        style={{ cursor: 'default', userSelect: 'none' }}
                    >
                        FM
                    </div>
                    <div className="nav-links">
                        {Object.entries(t.nav).map(([key, label]) => (
                            <a
                                key={key}
                                href={`#${key}`}
                                className={`nav-item ${activeSection === key ? 'active' : ''}`}
                                onClick={(e) => handleNavClick(e, key)}
                            >
                                {label}
                            </a>
                        ))}
                    </div>
                    <div className="nav-controls">
                        {isAdmin && (
                            <button
                                onClick={() => setIsAdmin(false)}
                                className="control-btn"
                                title="Logout Admin"
                                style={{
                                    background: '#ff4d4d',
                                    color: '#fff',
                                    fontSize: '1.2rem',
                                    padding: '8px 12px'
                                }}
                            >
                                🚪
                            </button>
                        )}
                        <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="control-btn">
                            {lang === 'en' ? 'AR' : 'EN'}
                        </button>
                    </div>
                </div>
            </nav>

            <main className="sections-wrapper">
                <section id="hero" className="transition-section">
                    <div className="section hero-container">
                        <div className="hero-image-wrapper">
                            <div className="hero-image-frame">
                                <img src="/Fares.jpeg" alt="Fares Mohammed" />
                            </div>
                        </div>
                        <div className="hero-content">
                            <h1>{t.hero.name}</h1>
                            <p className="tagline">{t.hero.tagline}</p>
                            <p className="hero-sentence">{t.hero.sentence}</p>
                            <div className="cta-buttons">
                                <a href="#projects" className="btn btn-primary" onClick={(e) => handleNavClick(e, 'projects')}>{t.hero.viewWork}</a>
                                <a href="#contact" className="btn btn-secondary" onClick={(e) => handleNavClick(e, 'contact')}>{t.hero.contact}</a>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="snapshot" className="transition-section">
                    <div className="section">
                        <h2 className="section-title">{t.snapshot.title}</h2>
                        <div className="snapshot-card-wrapper">
                            <div className="snapshot-card">
                                <p
                                    onMouseEnter={() => document.body.classList.add('cursor-focus')}
                                    onMouseLeave={() => document.body.classList.remove('cursor-focus')}
                                >
                                    {t.snapshot.content}
                                </p>
                            </div>
                            <div className="snapshot-card-blob"></div>
                        </div>
                    </div>
                </section>


                <section id="skills" className="transition-section">
                    <div className="section" style={{ maxWidth: '100%', padding: '0 20px' }}>
                        <h2 className="section-title">{t.skills.title}</h2>

                        <div className="skills-tabs">
                            {t.skills.categories.map((cat, i) => (
                                <button
                                    key={i}
                                    className={`skill-tab-btn ${activeSkillCategory === i ? 'active' : ''}`}
                                    onClick={() => setActiveSkillCategory(i)}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        <div className="skills-display-area">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeSkillCategory}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="skills-grid-full"
                                >
                                    {t.skills.categories[activeSkillCategory].items.map((skill, j) => (
                                        <div key={j} className="skill-pill-large">
                                            {skill}
                                        </div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </section>

                <section id="projects" className="transition-section">
                    <div className="section">
                        <h2 className="section-title">{t.projects.title}</h2>
                        <div className="projects-grid">
                            {t.projects.items.map((item) => (
                                <div key={item.id} className={`project-card ${item.isFeatured ? 'featured' : ''}`}>
                                    <div className="project-image">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} />
                                        ) : (
                                            <div className="project-placeholder">
                                                <span>{t.projects.placeholder}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="project-content">
                                        <h3>{item.name}</h3>
                                        <div className="project-tags">
                                            {item.tags.map((tag, j) => <span key={j}>{tag}</span>)}
                                        </div>
                                        <p className="project-desc">{item.desc}</p>
                                        <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                                            </svg>
                                            {t.projects.githubBtn}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="journey" className="transition-section">
                    <div className="section">
                        <h2 className="section-title">{t.journey.title}</h2>
                        <div className="journey-slider-container">
                            <button className="slider-nav-btn prev" onClick={() => scrollJourney('left')}>←</button>
                            <div className="journey-slider" ref={journeyRef}>
                                {t.journey.items.map((item) => (
                                    <div key={item.id} className="journey-slide-card no-image">
                                        <div className="journey-slide-badge">#{item.id}</div>
                                        <div className="journey-slide-content">
                                            <h3>{item.title}</h3>
                                            <p>{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="slider-nav-btn next" onClick={() => scrollJourney('right')}>→</button>
                        </div>
                    </div>
                </section>

                <section id="workflow" className="transition-section">
                    <div className="section">
                        <h2 className="section-title">{t.workflow.title}</h2>
                        <div className="workflow-grid">
                            {t.workflow.steps.map((step, i) => (
                                <div key={i} className="workflow-card">
                                    <div className="workflow-number">{i + 1}</div>
                                    <div className="workflow-card-content">
                                        <h3>{step.title}</h3>
                                        <p>{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="education" className="transition-section">
                    <div className="section">
                        <h2 className="section-title">{t.education.title}</h2>
                        <div className="education-header">
                            <h3>{t.education.school}</h3>
                            <p className="specialization">{t.education.specialization}</p>
                            <p className="period">{t.education.period}</p>
                        </div>
                        <div className="education-grid">
                            {t.education.grades.map((grade, i) => (
                                <div key={i} className="grade-card">
                                    <div className="grade-badge">{grade.year}</div>
                                    <ul className="subject-list">
                                        {grade.subjects.map((subject, j) => (
                                            <li key={j}>{subject}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="game" className="transition-section">
                    <div className="section game-wrapper">
                        {/* Arrow hint for first tile */}
                        {!isAdmin && !isGameWon && (
                            <div style={{
                                textAlign: 'center',
                                marginBottom: '15px',
                                color: 'var(--accent-color)',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}>
                                <span style={{ fontSize: '1.5rem' }}>
                                    {lang === 'ar' ? '←' : '→'}
                                </span>
                                <span>{lang === 'ar' ? 'ابدأ من هنا' : 'Start here'}</span>
                            </div>
                        )}

                        <div className={`puzzle-container ${isGameWon ? 'won' : ''}`} style={{ position: 'relative' }}>
                            {/* Arrow indicator on first tile */}
                            {!isAdmin && !isGameWon && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-30px',
                                    left: lang === 'ar' ? 'auto' : '10px',
                                    right: lang === 'ar' ? '10px' : 'auto',
                                    fontSize: '2rem',
                                    animation: 'bounce 2s infinite',
                                    zIndex: 10
                                }}>
                                    {lang === 'ar' ? '⬇' : '⬇'}
                                </div>
                            )}
                            {puzzle.map((val, i) => (
                                <div
                                    key={i}
                                    className={`puzzle-tile ${val === 0 ? 'empty' : ''}`}
                                    onClick={() => {
                                        if (!isAdmin) {
                                            moveTile(i)
                                        }
                                    }}
                                    style={{ cursor: isAdmin ? 'default' : 'pointer' }}
                                >
                                    {val !== 0 && <span>{val}</span>}
                                </div>
                            ))}
                        </div>

                        {/* Reset button for non-admin users */}
                        {!isAdmin && !isGameWon && (
                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                <button className="btn btn-secondary" onClick={shufflePuzzle}>
                                    {t.puzzleWin.resetBtn}
                                </button>
                            </div>
                        )}

                        {/* Admin Winners Display */}
                        {isAdmin && (
                            <div style={{ marginTop: '30px', maxWidth: '900px', margin: '30px auto 0' }}>
                                <h3 style={{ textAlign: 'center', color: 'var(--accent-color)', marginBottom: '20px' }}>
                                    {t.adminWinners.title}
                                </h3>
                                <div className="feedback-feed">
                                    <div className="feedback-list">
                                        {gameWinnersList.length === 0 && (
                                            <p className="no-feedback">{t.adminWinners.noWinners}</p>
                                        )}
                                        {gameWinnersList.map(winner => (
                                            <div key={winner.id} className="feedback-card" style={{ background: 'rgba(77, 255, 77, 0.05)', border: '1px solid rgba(77, 255, 77, 0.3)' }}>
                                                <div className="feedback-header">
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span className="feedback-author" style={{ color: 'var(--accent-color)' }}>
                                                            {winner.name}
                                                        </span>
                                                        <span style={{ fontSize: '0.9rem', color: '#4dff4d', marginTop: '4px' }}>{winner.email}</span>
                                                    </div>
                                                    <button
                                                        className="delete-btn"
                                                        onClick={() => handleDeleteWinner(winner.id)}
                                                        style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '1.2rem' }}
                                                        title="Delete Winner Entry"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                                {winner.message && (
                                                    <p className="feedback-message" style={{ marginTop: '10px', fontStyle: 'italic' }}>
                                                        "{winner.message}"
                                                    </p>
                                                )}
                                                <div className="feedback-footer">
                                                    <span className="feedback-date">{winner.date}</span>
                                                    <span style={{ fontSize: '0.9rem', color: '#888' }}>🏆 Winner</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Win overlay for non-admin users */}
                        {isGameWon && !isAdmin && (
                            <div className="puzzle-win-overlay">
                                {!hasWinnerSubmitted ? (
                                    <div className="winner-form-container">
                                        <h3>{t.puzzleWin.title}</h3>
                                        <p>{t.puzzleWin.subtitle}</p>
                                        <form onSubmit={handleWinnerSubmit}>
                                            <input
                                                type="text"
                                                placeholder={t.puzzleWin.name}
                                                required
                                                value={winnerData.name}
                                                onChange={(e) => setWinnerData({ ...winnerData, name: e.target.value })}
                                            />
                                            <input
                                                type="email"
                                                placeholder={t.puzzleWin.email}
                                                required
                                                value={winnerData.email}
                                                onChange={(e) => setWinnerData({ ...winnerData, email: e.target.value })}
                                            />
                                            <textarea
                                                placeholder={t.puzzleWin.message}
                                                value={winnerData.message}
                                                onChange={(e) => setWinnerData({ ...winnerData, message: e.target.value })}
                                                rows="3"
                                            ></textarea>
                                            <button type="submit" className="btn btn-primary" disabled={isWinnerSubmitting}>
                                                {isWinnerSubmitting ? '...' : t.puzzleWin.submit}
                                            </button>
                                        </form>
                                        <button className="btn btn-secondary" onClick={shufflePuzzle} style={{ marginTop: '10px' }}>
                                            {t.puzzleWin.playAgain}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="winner-thanks">
                                        <p>{t.puzzleWin.thanks}</p>
                                        <button className="btn btn-secondary" onClick={shufflePuzzle}>
                                            {t.puzzleWin.playAgain}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                <section id="feedback" className="transition-section">
                    <div className="section">
                        <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                            {t.feedback.title}
                            {isAdmin && <span style={{ fontSize: '0.8rem', background: '#ff4d4d', color: '#fff', padding: '2px 8px', borderRadius: '10px' }}>Admin</span>}
                        </h2>
                        <p className="section-intro">{t.feedback.intro}</p>

                        <div className="feedback-container">
                            {/* Submission Form */}
                            <div className="feedback-form-card">
                                <h3>{t.feedback.form.submit}</h3>
                                {/* Mascot Eyes */}
                                <div className="mascot-container">
                                    <div className="mascot-head">
                                        <div className="mascot-eye left">
                                            <div
                                                className="pupil"
                                                style={{
                                                    transform: focusedInput === 'email'
                                                        ? 'translate(0, 5px)'
                                                        : `translate(${focusedInput === 'name' || focusedInput === 'message' ? (cursorPos.x - 50) / 3 : 0}px, ${focusedInput === 'message' ? (cursorPos.y - 30) / 4 + 5 : focusedInput === 'name' ? 5 : 0}px)`
                                                }}
                                            />
                                        </div>
                                        <div className="mascot-eye right">
                                            <div
                                                className="pupil"
                                                style={{
                                                    transform: focusedInput === 'email'
                                                        ? 'translate(0, 5px)'
                                                        : `translate(${focusedInput === 'name' || focusedInput === 'message' ? (cursorPos.x - 50) / 3 : 0}px, ${focusedInput === 'message' ? (cursorPos.y - 30) / 4 + 5 : focusedInput === 'name' ? 5 : 0}px)`
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className={`mascot-hand left-hand ${focusedInput === 'email' ? 'covering' : ''}`}></div>
                                    <div className={`mascot-hand right-hand ${focusedInput === 'email' ? 'covering' : ''}`}></div>

                                </div>

                                {hasSubmittedFeedback ? (
                                    <div className="feedback-success-msg">
                                        <span className="success-icon">✓</span>
                                        {t.feedback.form.success}
                                    </div>
                                ) : (
                                    <form onSubmit={handleFeedbackSubmit}>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                placeholder={t.feedback.form.name}
                                                required
                                                value={feedbackForm.name}
                                                maxLength={40}
                                                onFocus={() => setFocusedInput('name')}
                                                onBlur={() => setFocusedInput(null)}
                                                onKeyUp={updateCursorPos}
                                                onClick={updateCursorPos}
                                                onChange={(e) => {
                                                    setFeedbackForm({ ...feedbackForm, name: e.target.value })
                                                    updateCursorPos(e)
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="email"
                                                placeholder={t.feedback.form.email}
                                                required
                                                value={feedbackForm.email}
                                                onFocus={() => setFocusedInput('email')}
                                                onBlur={() => setFocusedInput(null)}
                                                onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <textarea
                                                rows="4"
                                                placeholder={t.feedback.form.message}
                                                required
                                                value={feedbackForm.message}
                                                onFocus={() => setFocusedInput('message')}
                                                onBlur={() => setFocusedInput(null)}
                                                onKeyUp={updateCursorPos}
                                                onClick={updateCursorPos}
                                                onScroll={updateCursorPos}
                                                onChange={(e) => {
                                                    setFeedbackForm({ ...feedbackForm, message: e.target.value })
                                                    updateCursorPos(e)
                                                }}
                                            />
                                        </div>

                                        <button type="submit" className="btn btn-primary" disabled={isSubmittingFeedback}>
                                            {isSubmittingFeedback ? t.feedback.form.submitting : t.feedback.form.submit}
                                        </button>
                                    </form>
                                )}
                            </div>

                            <div className="feedback-feed">
                                <div className="feedback-list">
                                    {feedbackList.length === 0 && (
                                        <p className="no-feedback">{lang === 'en' ? "No feedback yet. Be the first!" : "لا توجد آراء بعد. كن أول من يشارك!"}</p>
                                    )}
                                    {feedbackList
                                        .filter(item => {
                                            // Admin sees all feedback
                                            if (isAdmin) return true
                                            // Approved feedback is visible to everyone
                                            if (item.approved === true) return true
                                            // User sees their own pending feedback
                                            if (item.sessionId === sessionId) return true
                                            return false
                                        })
                                        .map(item => (
                                            <div key={item.id} className={`feedback-card ${item.isStarred ? 'starred-message' : ''}`} style={{ opacity: item.approved === false ? 0.7 : 1, border: item.approved === false ? '1px dashed #ff4d4d' : undefined }}>
                                                <div className="feedback-header">
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span className="feedback-author" style={{ color: item.isStarred ? '#ffd700' : 'var(--accent-color)' }}>
                                                            {item.name}
                                                            {item.isStarred && <span style={{ marginLeft: '5px' }}>⭐</span>}
                                                            {isAdmin && item.approved === false && <span style={{ fontSize: '0.7rem', color: '#ff4d4d', marginLeft: '10px' }}>[Pending]</span>}
                                                        </span>
                                                        {isAdmin && item.email && <span style={{ fontSize: '0.8rem', color: '#888' }}>{item.email}</span>}
                                                    </div>
                                                    {isAdmin && (
                                                        <div style={{ display: 'flex', gap: '5px' }}>
                                                            {item.approved === false && (
                                                                <button
                                                                    className="approve-btn"
                                                                    onClick={() => handleApprove(item.id)}
                                                                    style={{ background: 'none', border: 'none', color: '#4dff4d', cursor: 'pointer', fontSize: '1.2rem' }}
                                                                    title="Approve Comment"
                                                                >
                                                                    ✅
                                                                </button>
                                                            )}
                                                            <button
                                                                className="delete-btn"
                                                                onClick={() => handleDelete(item.id)}
                                                                style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '1.2rem' }}
                                                                title="Delete Comment"
                                                            >
                                                                🗑️
                                                            </button>
                                                            <button
                                                                className="star-btn"
                                                                onClick={() => handleStar(item.id, item.isStarred)}
                                                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', opacity: item.isStarred ? 1 : 0.3 }}
                                                                title={item.isStarred ? "Unstar Message" : "Star Message"}
                                                            >
                                                                ⭐
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="feedback-message">"{item.message}"</p>
                                                <div className="feedback-footer">
                                                    <span className="feedback-date">{item.date}</span>
                                                    <button
                                                        className={`upvote-btn ${likedComments.includes(item.id) || isAdmin ? 'active' : ''}`}
                                                        onClick={() => handleUpvote(item.id)}
                                                    >
                                                        <span className="heart-icon">♥</span> {item.likes}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Admin Winners Panel - Only visible to admin */}
                {isAdmin && (
                    <section id="admin-winners" className="transition-section">
                        <div className="section">
                            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                                {t.adminWinners.title}
                                <span style={{ fontSize: '0.8rem', background: '#ff4d4d', color: '#fff', padding: '2px 8px', borderRadius: '10px' }}>Admin Only</span>
                            </h2>

                            <div className="feedback-feed" style={{ maxWidth: '900px', margin: '0 auto' }}>
                                <div className="feedback-list">
                                    {gameWinnersList.length === 0 && (
                                        <p className="no-feedback">{t.adminWinners.noWinners}</p>
                                    )}
                                    {gameWinnersList.map(winner => (
                                        <div key={winner.id} className="feedback-card" style={{ background: 'rgba(77, 255, 77, 0.05)', border: '1px solid rgba(77, 255, 77, 0.3)' }}>
                                            <div className="feedback-header">
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span className="feedback-author" style={{ color: 'var(--accent-color)' }}>
                                                        {winner.name}
                                                    </span>
                                                    <span style={{ fontSize: '0.9rem', color: '#4dff4d', marginTop: '4px' }}>{winner.email}</span>
                                                </div>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => handleDeleteWinner(winner.id)}
                                                    style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '1.2rem' }}
                                                    title="Delete Winner Entry"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                            {winner.message && (
                                                <p className="feedback-message" style={{ marginTop: '10px', fontStyle: 'italic' }}>
                                                    "{winner.message}"
                                                </p>
                                            )}
                                            <div className="feedback-footer">
                                                <span className="feedback-date">{winner.date}</span>
                                                <span style={{ fontSize: '0.9rem', color: '#888' }}>🏆 Winner</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                <section id="contact" className="transition-section">
                    <div className="section">
                        <h2 className="section-title">{t.contact.title}</h2>
                        <div className="contact-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                            <div className="contact-info" style={{ width: '100%', maxWidth: '100%', order: 'unset' }}>
                                <div className="contact-links-grid big-cards">
                                    {/* WhatsApp */}
                                    <a href={t.contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="contact-card big-card card-whatsapp">
                                        <div className="contact-icon"><FaWhatsapp /></div>
                                        <span>WhatsApp</span>
                                    </a>

                                    {/* Telegram */}
                                    <a href={t.contact.telegramUrl} target="_blank" rel="noopener noreferrer" className="contact-card big-card card-telegram">
                                        <div className="contact-icon"><FaTelegram /></div>
                                        <span>Telegram</span>
                                    </a>

                                    {/* LinkedIn */}
                                    <a href={t.contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="contact-card big-card card-linkedin">
                                        <div className="contact-icon"><FaLinkedin /></div>
                                        <span>LinkedIn</span>
                                    </a>

                                    {/* GitHub */}
                                    <a href={t.contact.githubUrl} target="_blank" rel="noopener noreferrer" className="contact-card big-card card-github">
                                        <div className="contact-icon"><FaGithub /></div>
                                        <span>GitHub</span>
                                    </a>

                                    {/* Phone Card */}
                                    <div
                                        className="contact-card big-card card-phone"
                                        onClick={() => {
                                            navigator.clipboard.writeText(t.contact.whatsapp)
                                            setShowPhoneCopied(true)
                                            setTimeout(() => setShowPhoneCopied(false), 2000)
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {showPhoneCopied ? (
                                            <div className="copied-overlay">
                                                <div className="check-icon-circle"><FaCheck /></div>
                                                <span className="copied-text">{t.contact.copied}</span>
                                                <span className="copied-number" dir="ltr">{t.contact.whatsapp}</span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="contact-icon"><FaPhone /></div>
                                                <span>{t.contact.whatsapp}</span>
                                                <span className="copy-hint">Click to Copy</span>
                                            </>
                                        )}
                                    </div>

                                    {/* Email Card */}
                                    <a href={`mailto:${t.contact.emailLabel}`} className="contact-card big-card card-email">
                                        <div className="contact-icon"><MdEmail /></div>
                                        <span>{t.contact.emailLabel}</span>
                                        <span className="copy-hint">Send Email</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <footer id="footer" className="footer-icons">
                            <div className="footer-socials">
                                <a href={t.contact.whatsappUrl} target="_blank" rel="noopener noreferrer" title="WhatsApp"><FaWhatsapp /></a>
                                <a href={t.contact.telegramUrl} target="_blank" rel="noopener noreferrer" title="Telegram"><FaTelegram /></a>
                                <a href={t.contact.linkedinUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn"><FaLinkedin /></a>
                                <a href={t.contact.githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub"><FaGithub /></a>
                                <a href={`mailto:${t.contact.emailLabel}`} title="Email"><MdEmail /></a>
                            </div>
                            <p
                                onClick={handleAdminToggle}
                                style={{ cursor: 'default', userSelect: 'none', marginTop: '15px', fontSize: '0.9rem', opacity: 0.5 }}
                            >
                                {t.footer}
                            </p>
                        </footer>
                    </div>
                </section>
            </main>
        </div >
    )
}

export default App
