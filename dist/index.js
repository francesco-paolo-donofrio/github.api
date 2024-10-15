"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
require("bootstrap/dist/css/bootstrap.min.css");
let string = 'sciao belo';
document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search');
    const searchBtn = document.getElementById('searchBtn');
    const searchTypeToggle = document.getElementById('searchType');
    const appDiv = document.getElementById('app');
    searchBtn.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        const search = searchBar.value.trim();
        const searchType = searchTypeToggle.value;
        console.log('Search button clicked. Search term:', search);
        if (search.length >= 3) {
            appDiv.innerHTML = '<p>Loading...</p>';
            try {
                const response = yield axios_1.default.get(`https://api.github.com/search/${searchType}`, {
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
                searchResults.forEach((item) => {
                    const card = document.createElement('div');
                    card.className = 'wrapper';
                    if (searchType === 'repositories') {
                        const repo = item;
                        card.innerHTML = `
                            <h1 class="repo-name">${repo.name}</h1>
                            <p class="repo-description">${repo.description || 'No description available.'}</p>
                            <p class="repo-stars">Stars: ${repo.stargazers_count}</p>
                            <div class="button-wrapper">
                                <a href="${repo.html_url}" target="_blank" class="btn outline repo-link">VIEW ON GITHUB</a>
                            </div>
                        `;
                    }
                    else if (searchType === 'users') {
                        const user = item;
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
            }
            catch (error) {
                console.error(`Error fetching ${searchType}:`, error);
                appDiv.innerHTML = '<p>An error occurred. Please try again.</p>';
            }
        }
        else {
            appDiv.innerHTML = "<p>Please enter at least 3 characters.</p>";
        }
    }));
});
//# sourceMappingURL=index.js.map