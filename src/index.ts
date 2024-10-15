document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    const searchBar = document.getElementById('search') as HTMLInputElement;
    const searchBtn = document.getElementById('searchBtn') as HTMLButtonElement;
    const searchTypeToggle = document.getElementById('searchType') as HTMLSelectElement;
    const appDiv = document.getElementById('app') as HTMLDivElement;

    if (!searchBar || !searchBtn || !searchTypeToggle || !appDiv) {
        console.error('One or more elements not found');
        return;
    }

    console.log('All elements found');

    searchBtn.addEventListener('click', async () => {
        console.log('Search button clicked');
        const search = searchBar.value.trim();
        const searchType = searchTypeToggle.value;

        console.log(`Search term: "${search}", Type: ${searchType}`);

        if (search.length >= 3) {
            appDiv.innerHTML = '<p>Loading...</p>';

            try {
                console.log(`Fetching: https://api.github.com/search/${searchType}?q=${encodeURIComponent(search)}&per_page=20`);
                const response = await fetch(`https://api.github.com/search/${searchType}?q=${encodeURIComponent(search)}&per_page=20`);
                
                console.log('Response received:', response);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Data parsed:', data);

                const searchResults = data.items || [];
                console.log('Search results:', searchResults);

                appDiv.innerHTML = '';

                if (searchResults.length === 0) {
                    appDiv.innerHTML = '<p>No results found.</p>';
                    return;
                }

                searchResults.forEach((item: any) => {
                    console.log('Processing item:', item);
                    const card = document.createElement('div');
                    card.className = 'wrapper';

                    if (searchType === 'repositories') {
                        card.innerHTML = `
                            <h1 class="repo-name">${item.name}</h1>
                            <p class="repo-description">${item.description || 'No description available.'}</p>
                            <p class="repo-stars">Stars: ${item.stargazers_count}</p>
                            <div class="button-wrapper">
                                <a href="${item.html_url}" target="_blank" class="btn outline repo-link">VIEW ON GITHUB</a>
                            </div>
                        `;
                    } else if (searchType === 'users') {
                        card.innerHTML = `
                            <img src="${item.avatar_url}" alt="${item.login}" class="avatar-image">
                            <h1 class="repo-name">${item.login}</h1>
                            <p class="repo-description">${item.type}</p>
                            <div class="button-wrapper">
                                <a href="${item.html_url}" target="_blank" class="btn outline repo-link">VIEW ON GITHUB</a>
                            </div>
                        `;
                    }

                    appDiv.appendChild(card);
                });

            } catch (error) {
                console.error(`Error fetching ${searchType}:`, error);
                appDiv.innerHTML = '<p>An error occurred. Please try again.</p>';
            }
        } else {
            appDiv.innerHTML = "<p>Please enter at least 3 characters.</p>";
        }
    });
});