// Global variables
let skills = [];
let projects = [];

// Add skill to the list
function addSkill() {
    const skillInput = document.getElementById('skillInput');
    const skill = skillInput.value.trim();

    if (skill && !skills.includes(skill)) {
        skills.push(skill);
        skillInput.value = '';
        updateSkillsList();
        updatePreview();
    }
}

// Remove skill from the list
function removeSkill(skill) {
    skills = skills.filter(s => s !== skill);
    updateSkillsList();
    updatePreview();
}

// Update skills display
function updateSkillsList() {
    const container = document.getElementById('skillsList');
    container.innerHTML = '';

    skills.forEach(skill => {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.innerHTML = `
            ${skill}
            <button onclick="removeSkill('${skill}')">×</button>
        `;
        container.appendChild(tag);
    });
}

// Add new project
function addProject() {
    const projectId = Date.now();
    projects.push({
        id: projectId,
        title: '',
        description: '',
        link: ''
    });
    updateProjectsList();
}

// Remove project
function removeProject(projectId) {
    projects = projects.filter(p => p.id !== projectId);
    updateProjectsList();
    updatePreview();
}

// Update projects display
function updateProjectsList() {
    const container = document.getElementById('projectsList');
    container.innerHTML = '';

    projects.forEach((project, index) => {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'project-item';
        projectDiv.innerHTML = `
            <div class="project-header">
                <h4>Project ${index + 1}</h4>
                <button class="btn-remove" onclick="removeProject(${project.id})">Remove</button>
            </div>
            <input type="text" placeholder="Project Title" 
                   value="${project.title}" 
                   onchange="updateProjectField(${project.id}, 'title', this.value)">
            <textarea placeholder="Project Description" rows="3"
                      onchange="updateProjectField(${project.id}, 'description', this.value)">${project.description}</textarea>
            <input type="url" placeholder="Project Link (optional)" 
                   value="${project.link}"
                   onchange="updateProjectField(${project.id}, 'link', this.value)">
        `;
        container.appendChild(projectDiv);
    });
}

// Update project field
function updateProjectField(projectId, field, value) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        project[field] = value;
        updatePreview();
    }
}

// Generate portfolio preview
function generatePortfolio() {
    const fullName = document.getElementById('fullName').value.trim();
    const title = document.getElementById('title').value.trim();
    const about = document.getElementById('about').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!fullName || !title || !about || !email) {
        alert('Please fill in all required fields (marked with *)');
        return;
    }

    if (skills.length === 0) {
        alert('Please add at least one skill');
        return;
    }

    updatePreview();
    document.getElementById('downloadBtn').style.display = 'block';
    alert('Portfolio generated successfully! You can now download the code.');
}

// Update preview in real-time
function updatePreview() {
    const preview = document.getElementById('preview');

    const fullName = document.getElementById('fullName').value.trim();
    const title = document.getElementById('title').value.trim();
    const about = document.getElementById('about').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const linkedin = document.getElementById('linkedin').value.trim();
    const github = document.getElementById('github').value.trim();

    if (!fullName && !title) {
        preview.innerHTML = '<p class="placeholder-text">Fill out the form to see your portfolio preview</p>';
        return;
    }

    let html = `
        <div class="preview-header">
            <h1>${fullName || 'Your Name'}</h1>
            <h2>${title || 'Your Title'}</h2>
        </div>
    `;

    if (about) {
        html += `
            <div class="preview-section-block">
                <h3>About Me</h3>
                <p>${about}</p>
            </div>
        `;
    }

    if (skills.length > 0) {
        html += `
            <div class="preview-section-block">
                <h3>Skills</h3>
                <div class="preview-skills">
                    ${skills.map(skill => `<span class="preview-skill">${skill}</span>`).join('')}
                </div>
            </div>
        `;
    }

    if (projects.length > 0 && projects.some(p => p.title)) {
        html += '<div class="preview-section-block"><h3>Projects</h3>';
        projects.forEach(project => {
            if (project.title) {
                html += `
                    <div class="preview-project">
                        <h4>${project.title}</h4>
                        ${project.description ? `<p>${project.description}</p>` : ''}
                        ${project.link ? `<p><a href="${project.link}" target="_blank">View Project →</a></p>` : ''}
                    </div>
                `;
            }
        });
        html += '</div>';
    }

    if (email || phone || linkedin || github) {
        html += '<div class="preview-section-block"><h3>Contact</h3><div class="preview-contact">';
        if (email) html += `<p>📧 Email: <a href="mailto:${email}">${email}</a></p>`;
        if (phone) html += `<p>📱 Phone: ${phone}</p>`;
        if (linkedin) html += `<p>💼 LinkedIn: <a href="${linkedin}" target="_blank">View Profile</a></p>`;
        if (github) html += `<p>💻 GitHub: <a href="${github}" target="_blank">View Profile</a></p>`;
        html += '</div></div>';
    }

    preview.innerHTML = html;
}

// Generate and download portfolio code
function downloadPortfolio() {
    const fullName = document.getElementById('fullName').value.trim();
    const title = document.getElementById('title').value.trim();
    const about = document.getElementById('about').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const linkedin = document.getElementById('linkedin').value.trim();
    const github = document.getElementById('github').value.trim();

    // Generate HTML file content
    const htmlContent = generateHTMLFile(fullName, title, about, email, phone, linkedin, github);
    const cssContent = generateCSSFile();

    // Create a ZIP-like text file with all three files
    const packagedContent = `
===========================================
YOUR PORTFOLIO CODE - READY TO USE
===========================================

===========================================
FILE 1: index.html
===========================================

${htmlContent}

===========================================
FILE 2: style.css
===========================================

${cssContent}

`;

    // Download as text file
    const blob = new Blob([packagedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fullName.replace(/\s+/g, '_')}_Portfolio_Code.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('Portfolio code downloaded! Check your downloads folder.');
}

// Generate HTML file for user's portfolio
function generateHTMLFile(fullName, title, about, email, phone, linkedin, github) {
    let projectsHTML = '';
    if (projects.length > 0 && projects.some(p => p.title)) {
        projectsHTML = `
        <section class="section">
            <h2>Projects</h2>`;
        projects.forEach(project => {
            if (project.title) {
                projectsHTML += `
            <div class="project-card">
                <h3>${project.title}</h3>
                ${project.description ? `<p>${project.description}</p>` : ''}
                ${project.link ? `<a href="${project.link}" target="_blank" class="project-link">View Project →</a>` : ''}
            </div>`;
            }
        });
        projectsHTML += `
        </section>`;
    }

    let contactHTML = '';
    if (email || phone || linkedin || github) {
        contactHTML = `
        <section class="section">
            <h2>Contact</h2>
            <div class="contact-info">`;
        if (email) contactHTML += `
                <p>📧 Email: <a href="mailto:${email}">${email}</a></p>`;
        if (phone) contactHTML += `
                <p>📱 Phone: ${phone}</p>`;
        if (linkedin) contactHTML += `
                <p>💼 LinkedIn: <a href="${linkedin}" target="_blank">View Profile</a></p>`;
        if (github) contactHTML += `
                <p>💻 GitHub: <a href="${github}" target="_blank">View Profile</a></p>`;
        contactHTML += `
            </div>
        </section>`;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fullName} - Portfolio</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>${fullName}</h1>
            <p class="subtitle">${title}</p>
        </header>

        <section class="section">
            <h2>About Me</h2>
            <p>${about}</p>
        </section>

        <section class="section">
            <h2>Skills</h2>
            <div class="skills-container">
                ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('\n                ')}
            </div>
        </section>
${projectsHTML}
${contactHTML}

        <footer>
            <p>&copy; ${new Date().getFullYear()} ${fullName}. All rights reserved.</p>
        </footer>
    </div>
</body>
</html>`;
}

// Generate CSS file for user's portfolio
function generateCSSFile() {
    return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #333;
    line-height: 1.6;
    min-height: 100vh;
    padding: 20px;
}

.container {
    max-width: 900px;
    margin: 0 auto;
    background: white;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    overflow: hidden;
}

.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-align: center;
    padding: 60px 20px;
}

.header h1 {
    font-size: 3rem;
    margin-bottom: 10px;
}

.subtitle {
    font-size: 1.5rem;
    opacity: 0.9;
}

.section {
    padding: 40px;
    border-bottom: 1px solid #e0e0e0;
}

.section:last-of-type {
    border-bottom: none;
}

.section h2 {
    color: #667eea;
    font-size: 2rem;
    margin-bottom: 20px;
    border-bottom: 3px solid #667eea;
    padding-bottom: 10px;
}

.section p {
    font-size: 1.1rem;
    color: #555;
    margin-bottom: 15px;
}

.skills-container {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.skill-tag {
    background: #667eea;
    color: white;
    padding: 10px 20px;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: 500;
}

.project-card {
    background: #f8f9fa;
    padding: 25px;
    border-radius: 8px;
    margin-bottom: 20px;
    border-left: 4px solid #667eea;
}

.project-card h3 {
    color: #667eea;
    font-size: 1.5rem;
    margin-bottom: 10px;
}

.project-card p {
    color: #666;
    margin-bottom: 15px;
}

.project-link {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s;
}

.project-link:hover {
    color: #764ba2;
    text-decoration: underline;
}

.contact-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.contact-info p {
    font-size: 1.1rem;
}

.contact-info a {
    color: #667eea;
    text-decoration: none;
    transition: color 0.3s;
}

.contact-info a:hover {
    color: #764ba2;
    text-decoration: underline;
}

footer {
    background: #f8f9fa;
    text-align: center;
    padding: 20px;
    color: #666;
}

@media (max-width: 768px) {
    .header h1 {
        font-size: 2rem;
    }

    .subtitle {
        font-size: 1.2rem;
    }

    .section {
        padding: 30px 20px;
    }

    .section h2 {
        font-size: 1.5rem;
    }
}`;
}

// Add event listeners for real-time preview
document.addEventListener('DOMContentLoaded', function() {
    const inputs = ['fullName', 'title', 'about', 'email', 'phone', 'linkedin', 'github'];
    inputs.forEach(inputId => {
        const element = document.getElementById(inputId);
        if (element) {
            element.addEventListener('input', updatePreview);
        }
    });

    // Allow Enter key to add skill
    document.getElementById('skillInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    });
});
