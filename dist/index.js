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
var _a, _b, _c, _d;
let currentPage = 1;
const resultsContainer = document.getElementById('results');
const loader = document.getElementById('loader');
function search(query_1, type_1) {
    return __awaiter(this, arguments, void 0, function* (query, type, page = 1) {
        let url = '';
        if (type === 'repositories') {
            url = `https://api.github.com/search/repositories?q=${query}&page=${page}`;
        }
        else {
            url = `https://api.github.com/search/users?q=${query}&page=${page}`;
        }
        loader.style.display = 'block';
        const response = yield fetch(url);
        const data = yield response.json();
        loader.style.display = 'none';
        return data.items;
    });
}
function displayResults(items, type) {
    resultsContainer.innerHTML = '';
    if (items.length === 0) {
        resultsContainer.textContent = 'No results found.';
        return;
    }
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('card');
        if (type === 'repositories') {
            itemElement.innerHTML = `<div class="banner-image"><img src="${item.owner.avatar_url}" /></div><strong>Repo:</strong> ${item.name}<br /><strong>Stars:</strong> ${item.stargazers_count}`;
        }
        else {
            itemElement.innerHTML = `<div class="banner-image">${item.avatar_url}</div><strong>User:</strong> ${item.login}<br /><strong>Profile:</strong> <a href="${item.html_url}" target="_blank">View</a>`;
        }
        resultsContainer === null || resultsContainer === void 0 ? void 0 : resultsContainer.appendChild(itemElement);
    });
}
function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}
const handleSearch = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = document.getElementById('search-input').value;
    const searchType = document.getElementById('search-type').value;
    if (query.length >= 3) {
        const results = yield search(query, searchType, currentPage);
        displayResults(results, searchType);
    }
    else {
        alert('Please enter at least 3 characters for the search.');
    }
});
(_a = document.getElementById('search-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', handleSearch);
const debouncedSearch = debounce(handleSearch, 700);
(_b = document.getElementById('search-input')) === null || _b === void 0 ? void 0 : _b.addEventListener('input', debouncedSearch);
(_c = document.getElementById('next-btn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    const query = document.getElementById('search-input').value;
    const searchType = document.getElementById('search-type').value;
    currentPage++;
    const results = yield search(query, searchType, currentPage);
    displayResults(results, searchType);
}));
(_d = document.getElementById('prev-btn')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    if (currentPage > 1) {
        currentPage--;
        const query = document.getElementById('search-input').value;
        const searchType = document.getElementById('search-type').value;
        const results = yield search(query, searchType, currentPage);
        displayResults(results, searchType);
    }
}));
//# sourceMappingURL=index.js.map