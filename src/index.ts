import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';


interface Repository {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
}

interface User {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
    type: string;
}

document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search') as HTMLInputElement;
    const searchBtn = document.getElementById('searchBtn') as HTMLButtonElement;
    const searchTypeToggle = document.getElementById('searchType') as HTMLSelectElement;
    const appDiv = document.getElementById('app') as HTMLDivElement;
    let string : string = 'sciao belo';

    searchBtn.addEventListener('click', async () => {
        const search = searchBar.value.trim();
        const searchType = searchTypeToggle.value;

        console.log('Search button clicked. Search term:', search);

        if (search.length >= 3) {
            appDiv.innerHTML = '<p>Loading...</p>';

            try {
                const response = await axios.get(`https://api.github.com/search/${searchType}`, {
                    params: {
                        q: search,
                        per_page: 20
                    }
                });
                const searchResults = response.data.items || [];
                console.log('Search results:', searchResults);

                appDiv.innerHTML = '';

                if (searchResults.length === 0) {
                    appDiv.innerHTML = '<p>No results found.</p>';
                    return;
                }

                searchResults.forEach((item: Repository | User) => {
                    const card = document.createElement('div');
                    card.className = 'wrapper';

                    if (searchType === 'repositories') {
                        const repo = item as Repository;
                        card.innerHTML = `
                            <h1 class="repo-name">${repo.name}</h1>
                            <p class="repo-description">${repo.description || 'No description available.'}</p>
                            <p class="repo-stars">Stars: ${repo.stargazers_count}</p>
                            <div class="button-wrapper">
                                <a href="${repo.html_url}" target="_blank" class="btn outline repo-link">VIEW ON GITHUB</a>
                            </div>
                        `;
                    } else if (searchType === 'users') {
                        const user = item as User;
                        card.innerHTML = `
                            <img src="${user.avatar_url}" alt="${user.login}" class="avatar-image">
                            <h1 class="repo-name">${user.login}</h1>
                            <p class="repo-description">${user.type}</p>
                            <div class="button-wrapper">
                                <a href="${user.html_url}" target="_blank" class="btn outline repo-link">VIEW ON GITHUB</a>
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
    console.log(string);
});