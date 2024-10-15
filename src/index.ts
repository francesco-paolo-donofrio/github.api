let currentPage = 1;
const resultsContainer = document.getElementById('results');
const loader = document.getElementById('loader');

// Function to make the GitHub API call
async function search(query: string, type: string, page: number = 1) {
  let url = '';
  if (type === 'repositories') {
    url = `https://api.github.com/search/repositories?q=${query}&page=${page}`;
  } else {
    url = `https://api.github.com/search/users?q=${query}&page=${page}`;
  }
  
  loader!.style.display = 'block'; // Show loader while waiting for results

  const response = await fetch(url);
  const data = await response.json();
  
  loader!.style.display = 'none'; // Hide loader when results are ready

  return data.items; // Array of repositories or users
}

// Function to display repositories or users/organizations
function displayResults(items: any[], type: string) {
  resultsContainer!.innerHTML = ''; // Clear previous results
  if (items.length === 0) {
    resultsContainer!.textContent = 'No results found.';
    return;
  }
  
  items.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('card');
    
    if (type === 'repositories') {
      itemElement.innerHTML = `<div class="banner-image"><img src="${item.owner.avatar_url}" /></div><strong>Repo:</strong> ${item.name}<br /><strong>Stars:</strong> ${item.stargazers_count}`;
    } else {
      itemElement.innerHTML = `<div class="banner-image">${item.avatar_url}</div><strong>User:</strong> ${item.login}<br /><strong>Profile:</strong> <a href="${item.html_url}" target="_blank">View</a>`;
    }

    resultsContainer?.appendChild(itemElement);
  });
}

// Debounce function to delay the search by 700ms
function debounce(fn: Function, delay: number) {
  let timer: NodeJS.Timeout;
  return function(...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Function to handle the search button click event
const handleSearch = async () => {
  const query = (document.getElementById('search-input') as HTMLInputElement).value;
  const searchType = (document.getElementById('search-type') as HTMLSelectElement).value;

  if (query.length >= 3) {
    const results = await search(query, searchType, currentPage);
    displayResults(results, searchType);
  } else {
    alert('Please enter at least 3 characters for the search.');
  }
};

// Attach the search function to the search button click
document.getElementById('search-btn')?.addEventListener('click', handleSearch);

// Attach debounce to the input field for real-time search (Bonus 1)
const debouncedSearch = debounce(handleSearch, 700);
document.getElementById('search-input')?.addEventListener('input', debouncedSearch);

// Pagination buttons
document.getElementById('next-btn')?.addEventListener('click', async () => {
  const query = (document.getElementById('search-input') as HTMLInputElement).value;
  const searchType = (document.getElementById('search-type') as HTMLSelectElement).value;

  currentPage++;
  const results = await search(query, searchType, currentPage);
  displayResults(results, searchType);
});

document.getElementById('prev-btn')?.addEventListener('click', async () => {
  if (currentPage > 1) {
    currentPage--;
    
    const query = (document.getElementById('search-input') as HTMLInputElement).value;
    const searchType = (document.getElementById('search-type') as HTMLSelectElement).value;

    const results = await search(query, searchType, currentPage);
    displayResults(results, searchType);
  }
});