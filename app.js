// Basic UI behavior hooks (framework-agnostic)
import { logout } from './js/api.js';

const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#navMenu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Dashboard Data
const dashboardData = {
  '': {
    waiting: 48,
    sessions: 12,
    successRate: '85%',
    avgTime: '14 days',
    requirements: [
      { icon: '📋', title: 'Valid Government ID', desc: 'Philippine passport, driver\'s license, or National ID' },
      { icon: '🎓', title: 'Educational Background Certificate', desc: 'High school diploma or equivalent (original and copy)' },
      { icon: '🏢', title: 'Work Experience Letter', desc: 'Proof of relevant industry experience (if applicable)' },
      { icon: '📸', title: 'Recent Passport Photos', desc: '4x6 inches, white background (2 pieces)' },
      { icon: '✍️', title: 'Assessment Registration Form', desc: 'Completed and signed form available at registration desk' },
      { icon: '💳', title: 'Assessment Fee Receipt', desc: 'Proof of payment (varies by qualification)' }
    ],
    selfAssessment: {
      title: 'Self-Assessment Form',
      desc: 'Official TESDA Self-Assessment Guide and Checklist',
      size: 'PDF • 2.4 MB',
      content: 'This comprehensive self-assessment guide helps you evaluate your knowledge, skills, and experience against the competency standards required for your chosen qualification. The form includes:',
      features: [
        '✓ Competency unit checklists',
        '✓ Knowledge and skill assessment questions',
        '✓ Experience verification guidelines',
        '✓ Training gap analysis',
        '✓ Readiness assessment score sheet'
      ]
    }
  },
  'ATS_NC_I': {
    waiting: 8,
    sessions: 2,
    successRate: '85%',
    avgTime: '12 days',
    requirements: [
      { icon: '📋', title: 'Valid Government ID', desc: 'Philippine passport, driver\'s license, or National ID' },
      { icon: '🎓', title: 'Secondary Education', desc: 'High school diploma or equivalent' },
      { icon: '🚗', title: 'Basic Automotive Knowledge', desc: 'Completion of automotive fundamentals' },
      { icon: '🔧', title: 'Hands-on Training', desc: 'Minimum 120 hours of basic automotive work' },
      { icon: '✍️', title: 'Assessment Registration Form', desc: 'Completed and signed form' },
      { icon: '💳', title: 'Assessment Fee Receipt', desc: '₱1,141.00 registration fee' }
    ],
    selfAssessment: {
      title: 'Automotive Servicing NC I Self-Assessment',
      desc: 'Basic vehicle maintenance competency evaluation',
      size: 'PDF • 2.0 MB',
      content: 'This self-assessment guide for Automotive Servicing NC I helps you evaluate your basic automotive maintenance skills. The form covers:',
      features: [
        '✓ Basic engine systems',
        '✓ Vehicle inspection procedures',
        '✓ Basic maintenance tasks',
        '✓ Safety protocols',
        '✓ Tool identification and use'
      ]
    }
  },
  'ATS_NC_II': {
    waiting: 15,
    sessions: 4,
    successRate: '83%',
    avgTime: '15 days',
    requirements: [
      { icon: '📋', title: 'Valid Government ID', desc: 'Philippine passport, driver\'s license, or National ID' },
      { icon: '🎓', title: 'Secondary Education', desc: 'High school diploma or equivalent' },
      { icon: '🚗', title: 'Automotive Fundamentals', desc: 'Completion of basic automotive mechanics course' },
      { icon: '🔧', title: 'Hands-on Experience', desc: 'Minimum 240 hours of automotive maintenance work' },
      { icon: '✍️', title: 'Assessment Registration Form', desc: 'Completed and signed form' },
      { icon: '💳', title: 'Assessment Fee Receipt', desc: '₱1,237.00 registration fee' }
    ],
    selfAssessment: {
      title: 'Automotive Servicing NC II Self-Assessment',
      desc: 'Vehicle maintenance and repair competency evaluation',
      size: 'PDF • 2.1 MB',
      content: 'This self-assessment guide for Automotive Servicing NC II helps you evaluate your comprehensive automotive repair skills. The form covers:',
      features: [
        '✓ Engine systems and diagnostics',
        '✓ Brake and suspension systems',
        '✓ Electrical and electronic systems',
        '✓ Vehicle maintenance procedures',
        '✓ Advanced repair techniques'
      ]
    }
  },
  'EIM_NC_II': {
    waiting: 10,
    sessions: 3,
    successRate: '86%',
    avgTime: '13 days',
    requirements: [
      { icon: '📋', title: 'Valid Government ID', desc: 'Philippine passport, driver\'s license, or National ID' },
      { icon: '🎓', title: 'Secondary Education', desc: 'High school diploma or equivalent' },
      { icon: '⚡', title: 'Electrical Safety Training', desc: 'Completion of electrical safety and basics course' },
      { icon: '🔌', title: 'Installation Experience', desc: 'Minimum 180 hours of electrical installation work' },
      { icon: '✍️', title: 'Assessment Registration Form', desc: 'Completed and signed form' },
      { icon: '💳', title: 'Assessment Fee Receipt', desc: '₱1,849.00 registration fee' }
    ],
    selfAssessment: {
      title: 'Electrical Installation & Maintenance NC II Self-Assessment',
      desc: 'Electrical systems and safety competency evaluation',
      size: 'PDF • 2.3 MB',
      content: 'This self-assessment guide for Electrical Installation and Maintenance NC II helps you evaluate your electrical competencies and safety knowledge. The form covers:',
      features: [
        '✓ Electrical safety procedures',
        '✓ Wiring and circuit installation',
        '✓ Electrical testing and measurement',
        '✓ Maintenance and troubleshooting',
        '✓ Regulatory compliance standards'
      ]
    }
  },
  'SMAW_NC_I': {
    waiting: 6,
    sessions: 2,
    successRate: '82%',
    avgTime: '14 days',
    requirements: [
      { icon: '📋', title: 'Valid Government ID', desc: 'Philippine passport, driver\'s license, or National ID' },
      { icon: '🎓', title: 'Secondary Education', desc: 'High school diploma or equivalent' },
      { icon: '🔥', title: 'Welding Fundamentals', desc: 'Completion of shielded metal arc welding basics' },
      { icon: '⚒️', title: 'Practical Welding', desc: 'Minimum 100 hours of welding practice' },
      { icon: '✍️', title: 'Assessment Registration Form', desc: 'Completed and signed form' },
      { icon: '💳', title: 'Assessment Fee Receipt', desc: '₱1,115.00 registration fee' }
    ],
    selfAssessment: {
      title: 'SMAW NC I Self-Assessment',
      desc: 'Basic welding techniques and safety competency evaluation',
      size: 'PDF • 2.0 MB',
      content: 'This self-assessment guide for Shielded Metal Arc Welding NC I helps you evaluate your basic welding skills and safety knowledge. The form covers:',
      features: [
        '✓ Welding safety procedures',
        '✓ Basic welding techniques',
        '✓ Electrode selection and preparation',
        '✓ Weld quality assessment',
        '✓ Equipment operation basics'
      ]
    }
  },
  'SMAW_NC_II': {
    waiting: 8,
    sessions: 2,
    successRate: '82%',
    avgTime: '16 days',
    requirements: [
      { icon: '📋', title: 'Valid Government ID', desc: 'Philippine passport, driver\'s license, or National ID' },
      { icon: '🎓', title: 'Secondary Education', desc: 'High school diploma or equivalent' },
      { icon: '🔥', title: 'Welding Fundamentals', desc: 'Completion of shielded metal arc welding basics' },
      { icon: '⚒️', title: 'Practical Welding', desc: 'Minimum 200 hours of welding practice and projects' },
      { icon: '✍️', title: 'Assessment Registration Form', desc: 'Completed and signed form' },
      { icon: '💳', title: 'Assessment Fee Receipt', desc: '₱1,137.00 registration fee' }
    ],
    selfAssessment: {
      title: 'SMAW NC II Self-Assessment',
      desc: 'Welding techniques and metal fabrication competency evaluation',
      size: 'PDF • 2.0 MB',
      content: 'This self-assessment guide for Shielded Metal Arc Welding NC II helps you evaluate your welding skills and safety knowledge. The form covers:',
      features: [
        '✓ Welding safety procedures',
        '✓ Electrode selection and preparation',
        '✓ Welding techniques and positions',
        '✓ Weld quality assessment',
        '✓ Equipment maintenance and operation'
      ]
    }
  },
  'MCG_NC_II': {
    waiting: 6,
    sessions: 2,
    successRate: '84%',
    avgTime: '14 days',
    requirements: [
      { icon: '📋', title: 'Valid Government ID', desc: 'Philippine passport, driver\'s license, or National ID' },
      { icon: '🎓', title: 'Secondary Education', desc: 'High school diploma or equivalent' },
      { icon: '🔧', title: 'Machining Fundamentals', desc: 'Completion of precision machining basics' },
      { icon: '⚙️', title: 'Practical Machining', desc: 'Minimum 160 hours of machining operations' },
      { icon: '✍️', title: 'Assessment Registration Form', desc: 'Completed and signed form' },
      { icon: '💳', title: 'Assessment Fee Receipt', desc: '₱1,285.00 registration fee' }
    ],
    selfAssessment: {
      title: 'Machining NC II Self-Assessment',
      desc: 'Precision machining and manufacturing competency evaluation',
      size: 'PDF • 2.2 MB',
      content: 'This self-assessment guide for Machining NC II helps you evaluate your precision machining skills and technical knowledge. The form covers:',
      features: [
        '✓ Machine tool operation',
        '✓ Precision measurement techniques',
        '✓ Material properties and selection',
        '✓ Quality control procedures',
        '✓ Safety protocols for machining'
      ]
    }
  },
  'CNC_LATHE_NC_II': {
    waiting: 4,
    sessions: 1,
    successRate: '88%',
    avgTime: '12 days',
    requirements: [
      { icon: '📋', title: 'Valid Government ID', desc: 'Philippine passport, driver\'s license, or National ID' },
      { icon: '🎓', title: 'Secondary Education', desc: 'High school diploma or equivalent' },
      { icon: '🔧', title: 'CNC Fundamentals', desc: 'Completion of CNC lathe machine operation basics' },
      { icon: '⚙️', title: 'CNC Programming', desc: 'Basic CNC programming and operation experience' },
      { icon: '✍️', title: 'Assessment Registration Form', desc: 'Completed and signed form' },
      { icon: '💳', title: 'Assessment Fee Receipt', desc: '₱1,385.00 registration fee' }
    ],
    selfAssessment: {
      title: 'CNC Lathe Machine Operation NC II Self-Assessment',
      desc: 'CNC lathe programming and operation competency evaluation',
      size: 'PDF • 2.1 MB',
      content: 'This self-assessment guide for CNC Lathe Machine Operation NC II helps you evaluate your CNC programming and machining skills. The form covers:',
      features: [
        '✓ CNC lathe machine setup',
        '✓ CNC programming fundamentals',
        '✓ Tool selection and setup',
        '✓ Quality assurance procedures',
        '✓ Maintenance and troubleshooting'
      ]
    }
  },
  'CNC_MILLING_NC_II': {
    waiting: 4,
    sessions: 1,
    successRate: '87%',
    avgTime: '12 days',
    requirements: [
      { icon: '📋', title: 'Valid Government ID', desc: 'Philippine passport, driver\'s license, or National ID' },
      { icon: '🎓', title: 'Secondary Education', desc: 'High school diploma or equivalent' },
      { icon: '🔧', title: 'CNC Milling Fundamentals', desc: 'Completion of CNC milling machine operation basics' },
      { icon: '⚙️', title: 'CNC Milling Programming', desc: 'CNC milling programming and operation experience' },
      { icon: '✍️', title: 'Assessment Registration Form', desc: 'Completed and signed form' },
      { icon: '💳', title: 'Assessment Fee Receipt', desc: '₱1,385.00 registration fee' }
    ],
    selfAssessment: {
      title: 'CNC Milling Machine Operation NC II Self-Assessment',
      desc: 'CNC milling programming and operation competency evaluation',
      size: 'PDF • 2.1 MB',
      content: 'This self-assessment guide for CNC Milling Machine Operation NC II helps you evaluate your CNC milling skills and technical knowledge. The form covers:',
      features: [
        '✓ CNC milling machine setup',
        '✓ CNC milling programming',
        '✓ Cutting tool selection',
        '✓ Precision machining techniques',
        '✓ Quality control and inspection'
      ]
    }
  },
  'COK_NC_II': {
    waiting: 12,
    sessions: 3,
    successRate: '89%',
    avgTime: '11 days',
    requirements: [
      { icon: '📋', title: 'Valid Government ID', desc: 'Philippine passport, driver\'s license, or National ID' },
      { icon: '🎓', title: 'Secondary Education', desc: 'High school diploma or equivalent' },
      { icon: '👨‍🍳', title: 'Culinary Fundamentals', desc: 'Completion of basic cooking and food safety course' },
      { icon: '🔪', title: 'Kitchen Experience', desc: 'Minimum 200 hours of professional cooking experience' },
      { icon: '✍️', title: 'Assessment Registration Form', desc: 'Completed and signed form' },
      { icon: '💳', title: 'Assessment Fee Receipt', desc: '₱1,907.00 registration fee' }
    ],
    selfAssessment: {
      title: 'Cookery NC II Self-Assessment',
      desc: 'Professional cooking and food preparation competency evaluation',
      size: 'PDF • 2.2 MB',
      content: 'This self-assessment guide for Cookery NC II helps you evaluate your cooking skills and food safety knowledge. The form covers:',
      features: [
        '✓ Food safety and hygiene procedures',
        '✓ Cooking techniques and methods',
        '✓ Menu planning and preparation',
        '✓ Kitchen equipment operation',
        '✓ Quality control and presentation'
      ]
    }
  },
  'MEC_NC_II': {
    waiting: 5,
    sessions: 2,
    successRate: '85%',
    avgTime: '13 days',
    requirements: [
      { icon: '📋', title: 'Valid Government ID', desc: 'Philippine passport, driver\'s license, or National ID' },
      { icon: '🎓', title: 'Secondary Education', desc: 'High school diploma or equivalent' },
      { icon: '🤖', title: 'Mechatronics Fundamentals', desc: 'Completion of automated systems and robotics basics' },
      { icon: '⚙️', title: 'Technical Experience', desc: 'Minimum 160 hours of mechatronics servicing work' },
      { icon: '✍️', title: 'Assessment Registration Form', desc: 'Completed and signed form' },
      { icon: '💳', title: 'Assessment Fee Receipt', desc: '₱1,301.00 registration fee' }
    ],
    selfAssessment: {
      title: 'Mechatronics Servicing NC II Self-Assessment',
      desc: 'Automated systems and robotics maintenance competency evaluation',
      size: 'PDF • 2.1 MB',
      content: 'This self-assessment guide for Mechatronics Servicing NC II helps you evaluate your automated systems and robotics skills. The form covers:',
      features: [
        '✓ Pneumatic and hydraulic systems',
        '✓ Electrical and electronic controls',
        '✓ PLC programming basics',
        '✓ System diagnostics and troubleshooting',
        '✓ Maintenance and repair procedures'
      ]
    }
  },
  'TEC_NC_II': {
    waiting: 7,
    sessions: 2,
    successRate: '87%',
    avgTime: '10 days',
    requirements: [
      { icon: '📋', title: 'Valid Government ID', desc: 'Philippine passport, driver\'s license, or National ID' },
      { icon: '🎓', title: 'Secondary Education', desc: 'High school diploma or equivalent' },
      { icon: '📐', title: 'Drafting Fundamentals', desc: 'Completion of technical drawing and CAD basics' },
      { icon: '💻', title: 'CAD Experience', desc: 'Minimum 120 hours of technical drafting work' },
      { icon: '✍️', title: 'Assessment Registration Form', desc: 'Completed and signed form' },
      { icon: '💳', title: 'Assessment Fee Receipt', desc: '₱1,046.00 registration fee' }
    ],
    selfAssessment: {
      title: 'Technical Drafting NC II Self-Assessment',
      desc: 'Engineering drawing and CAD design competency evaluation',
      size: 'PDF • 2.0 MB',
      content: 'This self-assessment guide for Technical Drafting NC II helps you evaluate your drafting and CAD skills. The form covers:',
      features: [
        '✓ Technical drawing standards',
        '✓ CAD software proficiency',
        '✓ Dimensioning and annotation',
        '✓ Blueprint reading and interpretation',
        '✓ Engineering documentation'
      ]
    }
  },
  'BPP_NC_II': {
    waiting: 9,
    sessions: 3,
    successRate: '88%',
    avgTime: '12 days',
    requirements: [
      { icon: '📋', title: 'Valid Government ID', desc: 'Philippine passport, driver\'s license, or National ID' },
      { icon: '🎓', title: 'Secondary Education', desc: 'High school diploma or equivalent' },
      { icon: '🍞', title: 'Baking Fundamentals', desc: 'Completion of bread and pastry production basics' },
      { icon: '🥖', title: 'Bakery Experience', desc: 'Minimum 180 hours of baking and pastry work' },
      { icon: '✍️', title: 'Assessment Registration Form', desc: 'Completed and signed form' },
      { icon: '💳', title: 'Assessment Fee Receipt', desc: '₱1,720.00 registration fee' }
    ],
    selfAssessment: {
      title: 'Bread and Pastry Production NC II Self-Assessment',
      desc: 'Baking and pastry arts competency evaluation',
      size: 'PDF • 2.1 MB',
      content: 'This self-assessment guide for Bread and Pastry Production NC II helps you evaluate your baking and pastry skills. The form covers:',
      features: [
        '✓ Baking techniques and methods',
        '✓ Ingredient knowledge and measurement',
        '✓ Food safety and hygiene',
        '✓ Product quality control',
        '✓ Equipment operation and maintenance'
      ]
    }
  },
  'DRV_NC_II': {
    waiting: 11,
    sessions: 3,
    successRate: '90%',
    avgTime: '9 days',
    requirements: [
      { icon: '📋', title: 'Valid Government ID', desc: 'Philippine passport, driver\'s license, or National ID' },
      { icon: '🚗', title: 'Valid Driver\'s License', desc: 'Professional driver\'s license (restriction code applicable)' },
      { icon: '🛣️', title: 'Driving Experience', desc: 'Minimum 1 year of professional driving experience' },
      { icon: '📋', title: 'Medical Certificate', desc: 'Current medical fitness certificate for drivers' },
      { icon: '✍️', title: 'Assessment Registration Form', desc: 'Completed and signed form' },
      { icon: '💳', title: 'Assessment Fee Receipt', desc: '₱1,034.00 registration fee' }
    ],
    selfAssessment: {
      title: 'Driving NC II Self-Assessment',
      desc: 'Professional driving and vehicle operation competency evaluation',
      size: 'PDF • 2.0 MB',
      content: 'This self-assessment guide for Driving NC II helps you evaluate your professional driving skills and knowledge. The form covers:',
      features: [
        '✓ Defensive driving techniques',
        '✓ Vehicle handling and control',
        '✓ Traffic laws and regulations',
        '✓ Passenger safety procedures',
        '✓ Emergency response protocols'
      ]
    }
  },
  'BRT_NC_II': {
    waiting: 8,
    sessions: 2,
    successRate: '86%',
    avgTime: '11 days',
    requirements: [
      { icon: '📋', title: 'Valid Government ID', desc: 'Philippine passport, driver\'s license, or National ID' },
      { icon: '🎓', title: 'Secondary Education', desc: 'High school diploma or equivalent' },
      { icon: '☕', title: 'Barista Training', desc: 'Completion of coffee preparation and service course' },
      { icon: '🏪', title: 'Service Experience', desc: 'Minimum 120 hours of food service experience' },
      { icon: '✍️', title: 'Assessment Registration Form', desc: 'Completed and signed form' },
      { icon: '💳', title: 'Assessment Fee Receipt', desc: '₱1,295.00 registration fee' }
    ],
    selfAssessment: {
      title: 'Barista NC II Self-Assessment',
      desc: 'Coffee preparation and service competency evaluation',
      size: 'PDF • 2.0 MB',
      content: 'This self-assessment guide for Barista NC II helps you evaluate your coffee preparation and service skills. The form covers:',
      features: [
        '✓ Coffee bean knowledge and selection',
        '✓ Espresso machine operation',
        '✓ Beverage preparation techniques',
        '✓ Customer service skills',
        '✓ Hygiene and safety standards'
      ]
    }
  },
  'VGD_NC_III': {
    waiting: 6,
    sessions: 2,
    successRate: '84%',
    avgTime: '13 days',
    requirements: [
      { icon: '📋', title: 'Valid Government ID', desc: 'Philippine passport, driver\'s license, or National ID' },
      { icon: '🎓', title: 'Secondary Education', desc: 'High school diploma or equivalent' },
      { icon: '🎨', title: 'Graphic Design Fundamentals', desc: 'Completion of visual communication and design basics' },
      { icon: '💻', title: 'Design Software Proficiency', desc: 'Experience with design software and tools' },
      { icon: '✍️', title: 'Assessment Registration Form', desc: 'Completed and signed form' },
      { icon: '💳', title: 'Assessment Fee Receipt', desc: '₱932.00 registration fee' }
    ],
    selfAssessment: {
      title: 'Visual Graphic Design NC III Self-Assessment',
      desc: 'Graphic design and visual communication competency evaluation',
      size: 'PDF • 2.1 MB',
      content: 'This self-assessment guide for Visual Graphic Design NC III helps you evaluate your graphic design and visual communication skills. The form covers:',
      features: [
        '✓ Design principles and theory',
        '✓ Software tool proficiency',
        '✓ Visual communication techniques',
        '✓ Project planning and execution',
        '✓ Client presentation skills'
      ]
    }
  }
};

// Dashboard functionality
document.addEventListener('DOMContentLoaded', () => {
  const qualificationSelect = document.getElementById('qualificationSelect');
  const requirementsList = document.getElementById('requirementsList');
  const qualificationsList = document.getElementById('qualificationsList');

  if (qualificationSelect) {
    qualificationSelect.addEventListener('change', (e) => {
      const selectedQualification = e.target.value;
      updateDashboard(selectedQualification);
    });
  }

  // Initialize dashboard on page load
  updateDashboard('');
});

function updateDashboard(qualificationId) {
  const data = dashboardData[qualificationId] || dashboardData[''];

  // Update stats
  document.getElementById('waitingCount').textContent = data.waiting;
  document.getElementById('sessionsCount').textContent = data.sessions;
  document.getElementById('successRate').textContent = data.successRate;
  document.getElementById('avgTime').textContent = data.avgTime;

  // Update requirements list
  if (requirementsList) {
    requirementsList.innerHTML = data.requirements.map(req => `
      <li class="requirement-item">
        <span class="requirement-icon">${req.icon}</span>
        <div>
          <strong>${req.title}</strong>
          <p class="muted">${req.desc}</p>
        </div>
      </li>
    `).join('');
  }

  // Update self-assessment guide
  if (data.selfAssessment) {
    document.getElementById('assessmentTitle').textContent = data.selfAssessment.title;
    document.getElementById('assessmentDesc').textContent = data.selfAssessment.desc;
    document.getElementById('assessmentSize').textContent = data.selfAssessment.size;
    document.getElementById('assessmentContent').textContent = data.selfAssessment.content;

    const featuresList = document.getElementById('assessmentFeatures');
    if (featuresList) {
      featuresList.innerHTML = data.selfAssessment.features.map(feature => `<li>${feature}</li>`).join('');
    }

    // Update download link for self-assessment guide
    const assessmentDownload = document.getElementById('assessmentDownload');
    if (assessmentDownload && qualificationId) {
      assessmentDownload.href = `./forms/${qualificationId}_Self_Assessment.pdf`;
    } else if (assessmentDownload) {
      assessmentDownload.href = '#';
    }
  }

  // Filter qualifications list based on selection
  if (qualificationsList) {
    const qualificationCards = qualificationsList.querySelectorAll('.qualification-card');
    qualificationCards.forEach(card => {
      if (!qualificationId) {
        // Show all when no filter
        card.style.display = '';
      } else {
        // This would need data attributes on the qualification cards to filter properly
        // For now, showing all
        card.style.display = '';
      }
    });
  }
}

// Placeholder for future API integration:
// Example: fetch featured programs or announcements for Home
async function loadHomeData() {
  // Later:
  // const res = await fetch("/api/programs?featured=true");
  // const data = await res.json();
  // renderFeaturedPrograms(data.items);
}

// Authentication handling
const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');
const profileBtn = document.getElementById('profileBtn');

const token = localStorage.getItem('token');

if (token) {
  // User is logged in
  if (signOutBtn) signOutBtn.style.display = 'inline-block';
  if (profileBtn) profileBtn.style.display = 'inline-block';
  if (signInBtn) signInBtn.style.display = 'none';
} else {
  // User is not logged in
  if (signInBtn) signInBtn.style.display = 'inline-block';
  if (signOutBtn) signOutBtn.style.display = 'none';
  if (profileBtn) profileBtn.style.display = 'none';
}

if (signOutBtn) {
  signOutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Sign out button clicked');
    await logout();
    console.log('Logout complete, redirecting...');
    setTimeout(() => {
      window.location.href = './signin.html';
    }, 100);
  });
}

if (signInBtn) {
  signInBtn.addEventListener('click', () => {
    window.location.href = './signin.html';
  });
}

loadHomeData();