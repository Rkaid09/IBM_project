let currentSection = 1;
const totalSections = 4;
let users = JSON.parse(localStorage.getItem('portfolioUsers')) || [];
const portfolioData = {
    about: {
        name: "",
        title: "",
        bio: "",
        image: ""
    },
    skills: [],
    projects: [],
    contact: {
        email: "",
        phone: "",
        linkedin: "",
        github: ""
    }
};
let currentUser = null;
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    if (users.length === 0) {
        showScreen('signupScreen');
    } else {
        showScreen('loginScreen');
    }
});
function initializeEventListeners() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    setupFormListeners();
    const skillInput = document.getElementById('skillInput');
    if (skillInput) {
        skillInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
            }
        });
    }
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((step, index) => {
        step.addEventListener('click', () => {
            if (index + 1 <= currentSection + 1) {
                goToSection(index + 1);
            }
        });
    });
    const profileImageInput = document.getElementById('profileImage');
    if (profileImageInput) {
        profileImageInput.addEventListener('change', handleImageUpload);
    }
}
function handleSignup(e) {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    if (password !== confirmPassword) {
        showSignupError('Passwords do not match!');
        return;
    }
    if (username.length < 3) {
        showSignupError('Username must be at least 3 characters long!');
        return;
    }
    if (password.length < 6) {
        showSignupError('Password must be at least 6 characters long!');
        return;
    }
    if (users.some(user => user.username === username)) {
        showSignupError('Username already exists!');
        return;
    }
    if (users.some(user => user.email === email)) {
        showSignupError('Email already registered!');
        return;
    }
    const newUser = {
        username,
        email,
        password,
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('portfolioUsers', JSON.stringify(users));
    showSignupSuccess();
    setTimeout(() => {
        showLoginScreen();
    }, 2000);
}
function showSignupSuccess() {
    const signupCard = document.querySelector('#signupScreen .login-card');
    signupCard.style.transform = 'scale(1.05)';
    signupCard.style.background = 'linear-gradient(135deg, #48bb78, #38a169)';
    signupCard.style.color = 'white';
    const form = document.getElementById('signupForm');
    form.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
            <h3 style="margin: 0 0 0.5rem 0;">Account Created!</h3>
            <p style="margin: 0; opacity: 0.9;">Redirecting to login...</p>
        </div>
    `;
    setTimeout(() => {
        signupCard.style.transform = 'scale(1)';
    }, 300);
}
function showSignupError(message) {
    const signupCard = document.querySelector('#signupScreen .login-card');
    signupCard.classList.add('shake');
    let errorDiv = document.getElementById('signupError');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'signupError';
        errorDiv.style.cssText = `
            background: #fed7d7;
            color: #c53030;
            padding: 0.75rem;
            border-radius: 0.5rem;
            margin-top: 1rem;
            text-align: center;
            font-size: 0.875rem;
        `;
        document.getElementById('signupForm').appendChild(errorDiv);
    }
    errorDiv.textContent = message;
    setTimeout(() => {
        signupCard.classList.remove('shake');
        errorDiv.remove();
    }, 3000);
}
function showSignupScreen() {
    showScreen('signupScreen');
}
function showLoginScreen() {
    showScreen('loginScreen');
}
function handleLogout() {
    currentUser = null;
    resetPortfolioData();
    if (users.length === 0) {
        showScreen('signupScreen');
    } else {
        showScreen('loginScreen');
    }
}
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const user = validateLogin(username, password);
    if (user) {
        currentUser = user;
        showLoginSuccess();
        setTimeout(() => {
            showScreen('formScreen');
            document.getElementById('mainNav').style.display = 'block';
        }, 1000);
    } else {
        showLoginError();
    }
}
function validateLogin(username, password) {
    return users.find(user => 
        user.username === username && user.password === password
    );
}
function showLoginSuccess() {
    const loginCard = document.querySelector('.login-card');
    loginCard.style.transform = 'scale(1.05)';
    loginCard.style.background = 'linear-gradient(135deg, #48bb78, #38a169)';
    loginCard.style.color = 'white';
    setTimeout(() => {
        loginCard.style.transform = 'scale(1)';
    }, 300);
}
function showLoginError() {
    const loginCard = document.querySelector('.login-card');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    loginCard.classList.add('shake');
    usernameInput.style.borderColor = '#f56565';
    passwordInput.style.borderColor = '#f56565';
    setTimeout(() => {
        loginCard.classList.remove('shake');
        usernameInput.style.borderColor = '';
        passwordInput.style.borderColor = '';
    }, 500);
}
function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        if (screenId === 'loginScreen') {
            document.getElementById('mainNav').style.display = 'none';
            const loginForm = document.getElementById('loginForm');
            if (loginForm) loginForm.reset();
        } else if (screenId === 'signupScreen') {
            document.getElementById('mainNav').style.display = 'none';
            const signupForm = document.getElementById('signupForm');
            if (signupForm) signupForm.reset();
        } else if (screenId === 'formScreen') {
            document.getElementById('mainNav').style.display = 'block';
            loadDataIntoForm();
        } else if (screenId === 'previewScreen') {
            generatePortfolioPreview();
        }
    }
}
function setupFormListeners() {
    const aboutInputs = ['fullName', 'jobTitle', 'bio'];
    aboutInputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', saveAboutData);
        }
    });
    const contactInputs = ['email', 'phone', 'linkedin', 'github'];
    contactInputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', saveContactData);
        }
    });
}
function saveAboutData() {
    portfolioData.about = {
        name: document.getElementById('fullName')?.value || '',
        title: document.getElementById('jobTitle')?.value || '',
        bio: document.getElementById('bio')?.value || '',
        image: document.getElementById('profileImage')?.value || ''
    };
}
function saveContactData() {
    portfolioData.contact = {
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        linkedin: document.getElementById('linkedin')?.value || '',
        github: document.getElementById('github')?.value || ''
    };
}
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        alert('Image file is too large. Please select a file smaller than 5MB.');
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        portfolioData.about.image = imageData;
        showImagePreview(imageData);
    };
    reader.readAsDataURL(file);
}
function showImagePreview(imageData) {
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    if (preview && previewImg) {
        previewImg.src = imageData;
        preview.style.display = 'block';
    }
}
function removeProfileImage() {
    portfolioData.about.image = '';
    const preview = document.getElementById('imagePreview');
    const fileInput = document.getElementById('profileImage');
    if (preview) {
        preview.style.display = 'none';
    }
    if (fileInput) {
        fileInput.value = '';
    }
}
function loadDataIntoForm() {
    if (portfolioData.about.name) {
        document.getElementById('fullName').value = portfolioData.about.name;
        document.getElementById('jobTitle').value = portfolioData.about.title;
        document.getElementById('bio').value = portfolioData.about.bio;
        if (portfolioData.about.image) {
            showImagePreview(portfolioData.about.image);
        }
    }
    if (portfolioData.contact.email) {
        document.getElementById('email').value = portfolioData.contact.email;
        document.getElementById('phone').value = portfolioData.contact.phone;
        document.getElementById('linkedin').value = portfolioData.contact.linkedin;
        document.getElementById('github').value = portfolioData.contact.github;
    }
    refreshSkillsList();
    refreshProjectsList();
}
function nextSection() {
    if (currentSection < totalSections) {
        if (validateCurrentSection()) {
            currentSection++;
            updateFormDisplay();
            updateProgressBar();
        }
    }
}
function previousSection() {
    if (currentSection > 1) {
        currentSection--;
        updateFormDisplay();
        updateProgressBar();
    }
}
function goToSection(sectionNumber) {
    if (sectionNumber >= 1 && sectionNumber <= totalSections) {
        currentSection = sectionNumber;
        updateFormDisplay();
        updateProgressBar();
    }
}
function updateFormDisplay() {
    const formSections = document.querySelectorAll('.form-section');
    formSections.forEach(section => {
        section.classList.remove('active');
    });
    const currentFormSection = document.querySelector(`[data-section="${currentSection}"]`);
    if (currentFormSection) {
        currentFormSection.classList.add('active');
    }
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const previewBtn = document.getElementById('previewBtn');
    if (currentSection === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'inline-flex';
    }
    if (currentSection === totalSections) {
        nextBtn.style.display = 'none';
        previewBtn.style.display = 'inline-flex';
    } else {
        nextBtn.style.display = 'inline-flex';
        previewBtn.style.display = 'none';
    }
}
function updateProgressBar() {
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        if (stepNumber === currentSection) {
            step.classList.add('active');
        } else if (stepNumber < currentSection) {
            step.classList.add('completed');
        }
    });
}
function validateCurrentSection() {
    switch (currentSection) {
        case 1: // About section
            const name = document.getElementById('fullName').value.trim();
            const title = document.getElementById('jobTitle').value.trim();
            const bio = document.getElementById('bio').value.trim();
            if (!name || !title || !bio) {
                alert('Please fill in all required fields in the About section.');
                return false;
            }
            return true;
        case 2: // Skills section
            if (portfolioData.skills.length === 0) {
                alert('Please add at least one skill.');
                return false;
            }
            return true;
        case 3: // Projects section
            if (portfolioData.projects.length === 0) {
                alert('Please add at least one project.');
                return false;
            }
            return true;
        case 4: // Contact section
            const email = document.getElementById('email').value.trim();
            if (!email) {
                alert('Please provide at least an email address.');
                return false;
            }
            return true;
        default:
            return true;
    }
}
function addSkill() {
    const skillInput = document.getElementById('skillInput');
    const skillValue = skillInput.value.trim();
    if (skillValue && !portfolioData.skills.includes(skillValue)) {
        portfolioData.skills.push(skillValue);
        skillInput.value = '';
        refreshSkillsList();
    } else if (portfolioData.skills.includes(skillValue)) {
        alert('This skill is already added!');
        skillInput.value = '';
    }
}
function removeSkill(skillToRemove) {
    portfolioData.skills = portfolioData.skills.filter(skill => skill !== skillToRemove);
    refreshSkillsList();
}
function refreshSkillsList() {
    const skillsList = document.getElementById('skillsList');
    if (!skillsList) return;
    skillsList.innerHTML = '';
    portfolioData.skills.forEach(skill => {
        const skillTag = document.createElement('div');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `
            <span>${skill}</span>
            <button type="button" class="remove-skill" onclick="removeSkill('${skill}')" title="Remove skill">
                <i class="fas fa-times"></i>
            </button>
        `;
        skillsList.appendChild(skillTag);
    });
}
function addProject() {
    const title = document.getElementById('projectTitle').value.trim();
    const description = document.getElementById('projectDescription').value.trim();
    const tech = document.getElementById('projectTech').value.trim();
    const demo = document.getElementById('projectDemo').value.trim();
    const repo = document.getElementById('projectRepo').value.trim();
    if (!title || !description || !tech) {
        alert('Please fill in at least the title, description, and technologies fields.');
        return;
    }
    const project = {
        id: Date.now(), // Simple ID generation
        title,
        description,
        technologies: tech.split(',').map(t => t.trim()),
        demoUrl: demo,
        repoUrl: repo
    };
    portfolioData.projects.push(project);
    document.getElementById('projectTitle').value = '';
    document.getElementById('projectDescription').value = '';
    document.getElementById('projectTech').value = '';
    document.getElementById('projectDemo').value = '';
    document.getElementById('projectRepo').value = '';
    refreshProjectsList();
}
function removeProject(projectId) {
    portfolioData.projects = portfolioData.projects.filter(project => project.id !== projectId);
    refreshProjectsList();
}
function refreshProjectsList() {
    const projectsList = document.getElementById('projectsList');
    if (!projectsList) return;
    projectsList.innerHTML = '';
    portfolioData.projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        const techTags = project.technologies.map(tech => 
            `<span>${tech}</span>`
        ).join('');
        const links = [];
        if (project.demoUrl) {
            links.push(`<a href="${project.demoUrl}" target="_blank"><i class="fas fa-external-link-alt"></i> Demo</a>`);
        }
        if (project.repoUrl) {
            links.push(`<a href="${project.repoUrl}" target="_blank"><i class="fab fa-github"></i> Code</a>`);
        }
        projectCard.innerHTML = `
            <button type="button" class="remove-project" onclick="removeProject(${project.id})" title="Remove project">
                <i class="fas fa-times"></i>
            </button>
            <h4>${project.title}</h4>
            <p>${project.description}</p>
            <div class="project-tech">${techTags}</div>
            <div class="project-links">${links.join('')}</div>
        `;
        projectsList.appendChild(projectCard);
    });
}
function generatePreview() {
    saveAboutData();
    saveContactData();
    showScreen('previewScreen');
}
function generatePortfolioPreview() {
    const previewContainer = document.getElementById('portfolioPreview');
    if (!previewContainer) return;
    const portfolioHTML = generatePortfolioHTML();
    previewContainer.innerHTML = portfolioHTML;
    setupPortfolioNavigation();
}
function generatePortfolioHTML() {
    const { about, skills, projects, contact } = portfolioData;
    const skillsHTML = skills.map(skill => `
        <div class="portfolio-skill">
            <i class="fas fa-code"></i>
            <h4>${skill}</h4>
        </div>
    `).join('');
    const projectsHTML = projects.map(project => {
        const techTags = project.technologies.map(tech => 
            `<span>${tech}</span>`
        ).join('');
        const links = [];
        if (project.demoUrl) {
            links.push(`<a href="${project.demoUrl}" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>`);
        }
        if (project.repoUrl) {
            links.push(`<a href="${project.repoUrl}" target="_blank"><i class="fab fa-github"></i> View Code</a>`);
        }
        return `
            <div class="portfolio-project">
                <div class="portfolio-project-content">
                    <h4>${project.title}</h4>
                    <p>${project.description}</p>
                    <div class="portfolio-project-tech">${techTags}</div>
                    <div class="portfolio-project-links">${links.join('')}</div>
                </div>
            </div>
        `;
    }).join('');
    const contactItems = [];
    if (contact.email) {
        contactItems.push(`
            <div class="portfolio-contact-item">
                <i class="fas fa-envelope"></i>
                <a href="mailto:${contact.email}">${contact.email}</a>
            </div>
        `);
    }
    if (contact.phone) {
        contactItems.push(`
            <div class="portfolio-contact-item">
                <i class="fas fa-phone"></i>
                <a href="tel:${contact.phone}">${contact.phone}</a>
            </div>
        `);
    }
    if (contact.linkedin) {
        contactItems.push(`
            <div class="portfolio-contact-item">
                <i class="fab fa-linkedin"></i>
                <a href="${contact.linkedin}" target="_blank">LinkedIn</a>
            </div>
        `);
    }
    if (contact.github) {
        contactItems.push(`
            <div class="portfolio-contact-item">
                <i class="fab fa-github"></i>
                <a href="${contact.github}" target="_blank">GitHub</a>
            </div>
        `);
    }
    return `
        <!-- Portfolio Header -->
        <header class="portfolio-header">
            ${about.image ? `<img src="${about.image}" alt="${about.name}" class="portfolio-avatar">` : ''}
            <h1 class="portfolio-name">${about.name}</h1>
            <p class="portfolio-title">${about.title}</p>
        </header>
        <!-- Portfolio Navigation -->
        <nav class="portfolio-nav">
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
        </nav>
        <!-- About Section -->
        <section id="about" class="portfolio-section">
            <h3>About Me</h3>
            <div class="portfolio-bio">
                <p>${about.bio}</p>
            </div>
        </section>
        <!-- Skills Section -->
        <section id="skills" class="portfolio-section">
            <h3>Skills & Technologies</h3>
            <div class="portfolio-skills">
                ${skillsHTML}
            </div>
        </section>
        <!-- Projects Section -->
        <section id="projects" class="portfolio-section">
            <h3>My Projects</h3>
            <div class="portfolio-projects">
                ${projectsHTML}
            </div>
        </section>
        <!-- Contact Section -->
        <section id="contact" class="portfolio-section">
            <div class="portfolio-contact">
                <h3>Get In Touch</h3>
                <p>Let's work together! Feel free to reach out through any of the following:</p>
                <div class="portfolio-contact-info">
                    ${contactItems.join('')}
                </div>
            </div>
        </section>
    `;
}
function setupPortfolioNavigation() {
    const navLinks = document.querySelectorAll('.portfolio-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}
function downloadPortfolio() {
    const htmlContent = generateStandaloneHTML();
    const cssContent = generateStandaloneCSS();
    const jsContent = generateStandaloneJS();
    downloadFile('index.html', htmlContent, 'text/html');
    downloadFile('style.css', cssContent, 'text/css');
    downloadFile('script.js', jsContent, 'text/javascript');
    showDownloadSuccess();
}
function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    setTimeout(() => URL.revokeObjectURL(url), 100);
}
function generateStandaloneHTML() {
    const { about, skills, projects, contact } = portfolioData;
    const portfolioHTML = generatePortfolioHTML();
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${about.name} - Portfolio</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="portfolio-container">
        ${portfolioHTML}
    </div>
    <script src="script.js"></script>
</body>
</html>`;
}
function generateStandaloneCSS() {
${document.querySelector('style') ? document.querySelector('style').textContent : ''}
.portfolio-container {
    max-width: 1000px;
    margin: 2rem auto;
    padding: 0 1.5rem;
}
html {
    scroll-behavior: smooth;
}
body {
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    color: #2d3748;
    background: #f8fafc;
}
}
function generateStandaloneJS() {
    return `// Portfolio Navigation Script
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.portfolio-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    document.querySelectorAll('.portfolio-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });
});
}
function showDownloadSuccess() {
    const successMessage = document.createElement('div');
    successMessage.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                    background: linear-gradient(135deg, #48bb78, #38a169); color: white; 
                    padding: 2rem; border-radius: 1rem; box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    z-index: 1000; text-align: center; animation: slideUp 0.5s ease-out;">
            <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
            <h3 style="margin: 0 0 0.5rem 0;">Download Complete!</h3>
            <p style="margin: 0; opacity: 0.9;">Your portfolio files are ready to use</p>
        </div>
    `;
    document.body.appendChild(successMessage);
    setTimeout(() => {
        successMessage.remove();
    }, 3000);
}
function resetPortfolioData() {
    portfolioData.about = { name: "", title: "", bio: "", image: "" };
    portfolioData.skills = [];
    portfolioData.projects = [];
    portfolioData.contact = { email: "", phone: "", linkedin: "", github: "" };
    const portfolioForm = document.getElementById('portfolioForm');
    if (portfolioForm) {
        portfolioForm.reset();
    }
    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview) {
        imagePreview.style.display = 'none';
    }
    refreshSkillsList();
    refreshProjectsList();
    currentSection = 1;
    updateFormDisplay();
    updateProgressBar();
}
