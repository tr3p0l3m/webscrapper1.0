//require puppeteer
const puppeteer = require('puppeteer');
//require prompt
const prompt = require('prompt');

//function that cleans url user input
function clean_url(url) {
    //if url does not start with http:// or https:// or http://www., add http://www.
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('http://www.')) {
        url = 'http://www.' + url;
    }

    //if url does not end with .com, .org, .net, .edu, .gov, or .mil, add .com
    if (!url.endsWith('.com') && !url.endsWith('.org') && !url.endsWith('.net') && !url.endsWith('.edu') && !url.endsWith('.gov') && !url.endsWith('.mil')) {
        url = url + '.com';
    }

    //return cleaned url
    return url;
}

//async function
async function run_shotter() {
    //start the prompt
    prompt.start();

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    //ask user for url
    prompt.get(['Enter url here '], function (err, result) {
        //add clean user input to url
        var url = result['Enter url here '];
        url = clean_url(url);
        //log url
        console.log('url: ' + url);
        //go to url and catch error if any
        page.goto(url).catch(function (err) {
            console.log('Error: ' + "Bad url");
            //exit
            process.exit();
        });
        //wait for 5 seconds
        setTimeout(async () => {
            //assign the title to a variable
            const title = await page.title();

            //screenshot page and save with title
            const shotter = await page.screenshot({ path: `./screenshots/${title}.png`, fullPage: true });

            //if screenshot successful, log success
            if (shotter) {
                console.log('Screenshot successful!');
            }
            //close browser and catch errors
            try {
                //close browser
                await browser.close();
            } catch (error) {
                console.log("Error: " + "Browser closed.");
            }
        }, 5000);
    });
}

//run function
run_shotter();