const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to programming. It introduces the building blocks of programming languages (variables, decisions, calculations, loops, arrays, and input/output) and uses them to solve problems.',
        technology: ['Python'],
        completed: true,
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students with little or no background to the World Wide Web. Topics include Internet, web browsers, HTML, CSS, ethics, and the publishing of websites.',
        technology: ['HTML', 'CSS'],
        completed: true,
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call, debug, and test their own functions; and to handle errors within functions.',
        technology: ['Python'],
        completed: true,
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces the notion of classes and objects. It presents encapsulation at a conceptual level. It also discusses the role of classes in software development.',
        technology: ['C#'],
        completed: false,
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience with Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: true,
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience in Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: false,
    },
];

const courseListEl = document.getElementById('courseList');
const totalCreditsEl = document.getElementById('totalCredits');
const filterButtons = document.querySelectorAll('.filter');

function renderCourses(filter = 'all') {
    if (!courseListEl) return;

    const filtered =
        filter === 'all'
            ? courses
            : courses.filter((c) => c.subject === filter);

    courseListEl.innerHTML = '';

    filtered.forEach((course) => {
        const card = document.createElement('div');
        card.className = `course-card${course.completed ? ' completed' : ''}`;
        card.textContent = `${course.subject} ${course.number}`;
        card.setAttribute(
            'aria-label',
            `${course.subject} ${course.number}${course.completed ? ' (completed)' : ''}`
        );
        courseListEl.appendChild(card);
    });

    const totalCredits = filtered.reduce((sum, c) => sum + c.credits, 0);
    if (totalCreditsEl) {
        totalCreditsEl.textContent = totalCredits;
    }
}

filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        renderCourses(btn.dataset.filter);
    });
});

renderCourses();
