// Immediately apply the preferred theme based on localStorage or system setting
(function() {
  const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
})();

// Add event listener to the toggle button
const themeToggleButton = document.getElementById('theme-toggle');
const themeToggleIcon = document.getElementById('theme-toggle-icon');

themeToggleButton.addEventListener('click', function() {
  // Toggle the 'dark' class on the document's root element
  document.documentElement.classList.toggle('dark');
  
  // Save the user's preference in localStorage
  if (document.documentElement.classList.contains('dark')) {
    localStorage.setItem('theme', 'dark');
    themeToggleIcon.classList.remove('fa-sun');
    themeToggleIcon.classList.add('fa-moon');
  } else {
    localStorage.setItem('theme', 'light');
    themeToggleIcon.classList.remove('fa-moon');
    themeToggleIcon.classList.add('fa-sun');
  }
});

// Set the icon based on the current theme
if (document.documentElement.classList.contains('dark')) {
  themeToggleIcon.classList.remove('fa-sun');
  themeToggleIcon.classList.add('fa-moon');
} else {
  themeToggleIcon.classList.remove('fa-moon');
  themeToggleIcon.classList.add('fa-sun');
}
    