function loadContent(name) {    
    const filename = 'content/' + name;
    // Ask for file to server
    fetch(filename).then(res => {
        if (res.ok) {
            res.text().then(file => {
                // Convert to HTML
                const content = document.querySelector('#content');
                content.innerHTML = MDtoHTML(file);
                addFunctionality(content);
            });
        } else {
            console.log('You dun goofed');
            loadContent('main.md');
        }
    });
}

function MDtoHTML(markdown) {
    let html = markdown;
    // Replace custom tags for divs with classnames
    html = html.replace(/\<([A-Z].*?)\b(.*?)(?:class=\"(.*?)\"|)\>(.*?)<\/\1>/gms, '<div class="$1 $3" $2>$4</div>');
    return marked.parse(html);
}

// Load route if exists
const route = document.location.hash.split('#')[1];

if (route !== undefined) 
    loadContent(route);
else
    loadContent('main.md');


// Add functionality to custom tags
function addFunctionality(element) {
    
    // Add classes to images
    const images = document.querySelectorAll('img');
    images.forEach(image => {
        if (image.parentElement.innerText === '')
        image.classList.add('image-block');
    });

    // Add tags
    for (tag in tags) {
        const elements = element.querySelectorAll('.' + tag);
        elements.forEach(element => tags[tag](element));
    }
}

// Custom tags
var tags = {
    /**
     * @brief Captions for the img tag
     * @details It searches the previous img children, so if none is present the tag is destroyed
     */
    'Caption': tag => {
        const referedImage = tag.previousElementSibling.querySelector('.image-block');
        if (referedImage !== null) {
            const parent = referedImage.parentElement;
            const figure = document.createElement('figure');
            figure.append(referedImage);
            const caption = document.createElement('figcaption');
            caption.innerHTML = tag.innerHTML;
            figure.append(caption);
            parent.append(figure);
            tag.remove();
        } else
            tag.remove(); // Self-destruct
    },
    /**
     * @brief Person information
     */
    'Person': tag => {
        const img_widths = [128, 256, 384];

        const p_img = tag.getAttribute('photo');
        const p_name = tag.getAttribute('name') || ''
        const p_desc = tag.innerHTML;
        tag.innerHTML = '';
        // Add image
        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');

        const photo = document.createElement('img');

        if (p_img != undefined) {
            photo.src = `resources/persons/${Math.max(...img_widths)}w/` + p_img;
            photo.sizes = '8rem';
            img_widths.forEach((width, idx, arr) => {
                photo.srcset += `resources/persons/${width}w/${p_img} ${width}w`;
                if (idx != arr.length - 1)
                    photo.srcset += ',';
            });
        } else
            photo.src = 'resources/default/person.png';

        photo.loading = "lazy";
        wrapper.append(photo);

        const name = document.createElement('h1');
        name.innerHTML = p_name;
        tag.append(name);

        
        if (p_desc === '') {
            tag.classList.add('stackable');
            // Check if there is stackable context
            if (tag.previousElementSibling !== null && tag.previousElementSibling.classList.contains('stackable_context')) {
                tag.previousElementSibling.append(tag);
            } else {
                const stackable_context = document.createElement('div');
                stackable_context.classList.add('stackable_context');
                tag.parentElement.insertBefore(stackable_context, tag.nextElementSibling)
                stackable_context.append(tag);
            } // Rain world
        } else {
            const desc = document.createElement('p');
            desc.innerHTML = p_desc;
            wrapper.append(desc);
        }
        
        tag.append(wrapper);
    },

    'Research': tag => {
        const img_widths = [240, 420, 720];

        const p_img = tag.getAttribute('img');
        const p_title = tag.getAttribute('title');
        const p_text = tag.innerHTML;
        tag.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');
        
        if (p_img != undefined) {
            const img = document.createElement('img');
            img.src = `resources/research/${p_img}`;
            img.sizes = '15rem';
            img_widths.forEach((width, idx, arr) => {
                img.srcset += `resources/research/${width}w/${p_img} ${width}w`;
                if (idx != arr.length - 1)
                    img.srcset += ',';
            });
            img.loading = "lazy";
            wrapper.append(img);
        } else
            wrapper.classList.add('no-image');

        const title = document.createElement('h1');
        title.innerHTML = p_title;
        wrapper.append(title);
        
        tag.append(wrapper);

        // Expand button
        const more = 'Mostrar más';
        const less = 'Mostrar menos'

        const button = document.createElement('div');
        button.innerHTML = more;
        button.classList.add('expand');


        button.addEventListener('click', evt => {
            const siblings = tag.parentElement.querySelectorAll('div.Research');
            siblings.forEach(elem => {
                if (elem !== tag)
                    elem.classList.remove('extended');
                elem.querySelector('.expand').innerHTML = more;
            });
            tag.classList.toggle('extended');
            extended = tag.classList.contains('extended');
            button.innerHTML = extended ? less:more
            if (extended) {
                setTimeout(() => {
                    tag.scrollIntoView({
                        block: "center"
                    });
                }, 300);
            }
        })

        tag.append(button);

        const text = document.createElement('p');
        text.innerHTML = p_text;
        tag.append(text);
        
        //Add research projects into container for 
        if (tag.previousElementSibling !== null && tag.previousElementSibling.classList.contains('research_container')) {
            tag.previousElementSibling.append(tag);
        } else {
            const research_container = document.createElement('div');
            research_container.classList.add('research_container');
            tag.parentElement.insertBefore(research_container, tag.nextElementSibling)
            research_container.append(tag);
        }

    }
};
