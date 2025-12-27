(function main() {
    const { Player, Playbar, PopupModal, Platform } = Spicetify;

    if (!Player || !Playbar || !PopupModal || !Platform) {
        setTimeout(main, 100);
        return;
    }

    const style = document.createElement('style');
    style.innerHTML = `
        .sample-modal-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            text-align: center;
        }
        .sample-modal-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 8px;
            color: #1DB954;
            text-align: center;
        }
        .sample-modal-artist {
            font-size: 18px;
            margin-bottom: 24px;
            opacity: 0.8;
        }
        .sample-button-group {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            justify-content: center;
        }
        .sample-btn {
            background-color: #1DB954;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 50px;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s, background-color 0.2s;
        }
        .sample-btn:hover {
            transform: scale(1.05);
            background-color: #1ed760;
        }
        .sample-btn.secondary {
            background-color: #333;
        }
        .sample-btn.secondary:hover {
            background-color: #444;
        }
        #copy-search {
            transition: all 0.2s ease-in-out;
        }

        #copy-search.copied {
            transform: scale(1.1);
            color: #4BB543; /* Success Green */
        }
    `;
    
    document.head.appendChild(style);

    function showSampleModal() {
        const meta = Spicetify.Player.data?.item;

        const artist = meta.artists.map(artist => artist.name).join(", ");
        const trackName = meta.name;

        const whoSampledUrl = `https://www.whosampled.com/search/?q=${encodeURIComponent(artist + " " + trackName)}`;

        const content = document.createElement("div");
        content.className = "sample-modal-container";
        content.innerHTML = `
            <div class="sample-modal-title">${trackName}</div>
            <div class="sample-modal-artist">by ${artist}</div>
            <div class="sample-button-group">
                <button class="sample-btn" id="open-whosampled">find samples (via WhoSampled)</button>
                <button class="sample-btn secondary" id="copy-search">copy search query</button>
            </div>
        `;

        content.querySelector("#open-whosampled").onclick = () => window.open(whoSampledUrl, "_blank");
        const copyBtn = content.querySelector("#copy-search");

        copyBtn.onclick = () => {
            const searchQuery = `${artist} ${trackName}`;
    
            navigator.clipboard.writeText(searchQuery).then(() => {
                const originalText = copyBtn.innerText;

                copyBtn.innerText = "Done!";
        
                copyBtn.classList.add("copied");

                setTimeout(() => {
                    copyBtn.innerText = originalText;
                    copyBtn.classList.remove("copied");
                }, 2000);
            });
        };

        PopupModal.display({
            title: "quick sample finder",
            content: content,
        });
    }

    const topbarButton = new Playbar.Button(
        "Sample Search",
        "album",
        showSampleModal
    );

    console.log("loaded quick sample searcher <3");
})();