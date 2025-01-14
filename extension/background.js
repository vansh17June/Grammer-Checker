chrome.runtime.onInstalled.addListener(() => {
    // Create context menu item when extension is installed
    chrome.contextMenus.create({
        id: "check-grammar",
        title: "Check Grammar",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info && info.menuItemId === "check-grammar" && info.selectionText) {
        // Execute the grammar check on the selected text
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: checkGrammar,
            args: [info.selectionText]
        });
    }
});

// Function that will be executed in the content script
async function checkGrammar(selectedText) {
    if (!selectedText) return;

    // Show a loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.innerHTML = "Checking grammar...";
    loadingIndicator.style.position = 'fixed';
    loadingIndicator.style.top = '10px';
    loadingIndicator.style.left = '10px';
    loadingIndicator.style.padding = '10px';
    loadingIndicator.style.background = 'rgba(0, 0, 0, 0.8)';
    loadingIndicator.style.color = 'white';
    loadingIndicator.style.fontSize = '14px';
    loadingIndicator.style.borderRadius = '5px';
    loadingIndicator.style.zIndex = '9999';
    document.body.appendChild(loadingIndicator);

    try {
        // Send the selected text to the backend for grammar checking
        const response = await fetch('https://grammer-checker-backend-cvqc.onrender.com/submit/CheckGrammer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: selectedText })
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const result = await response.json();

        if (result?.receivedData?.response?.candidates?.length > 0) {
            const correctedText = result.receivedData.response.candidates[0].content.parts[0].text;

            // Get the current selection
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const parentElement = range.commonAncestorContainer;

                // Only replace text if the selection is inside an editable field
                if (
                    parentElement.nodeType === Node.TEXT_NODE ||
                    parentElement.isContentEditable ||
                    parentElement.tagName === 'INPUT' ||
                    parentElement.tagName === 'TEXTAREA'
                ) {
                    range.deleteContents();
                    range.insertNode(document.createTextNode(correctedText));
                } else {
                    // If text is not editable, provide a copy-paste option
                    const copyText = correctedText;
                    const userConfirmed = confirm("The selected text is not editable. Do you want to copy the corrected text?");
                    if (userConfirmed) {
                        // Copy the corrected text to clipboard
                        try {
                            await navigator.clipboard.writeText(copyText);
                            alert("Corrected text has been copied to clipboard.");
                        } catch (copyError) {
                            console.error("Error copying text:", copyError);
                            alert("Failed to copy the corrected text.");
                        }
                    }
                }
            }
        } else {
            alert("No grammar suggestions found for the selected text.");
        }
    } catch (error) {
        console.error("Error while checking grammar:", error);
        alert("An error occurred while checking grammar. Please try again.");
    } finally {
        // Remove loading indicator after processing
        document.body.removeChild(loadingIndicator);
    }
}
