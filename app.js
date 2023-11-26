function toggleModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    const isActive = modal.classList.contains('modal__active');

    // Close all modals
    document.querySelectorAll('.modal').forEach((m) => {
        m.classList.remove('modal__active');
    });

    // Toggle the modal based on its previous state
    if (!isActive) {
        console.log(modal);

        modal.classList.add('modal__active');

        // Add escape key listener
        modal.addEventListener('keyup', (event)=>{
            if(event.key === 'Escape'){
                modal.classList.remove('modal__active');
                const correspondingToggle = document.querySelector(`[ aria-controls=${modal.attributes.id.value}]`);
                correspondingToggle.focus();
                correspondingToggle.ariaExpanded = 'false';
            }
        });

        // Add menuitem key listener
        const menuItems = modal.querySelectorAll('[role="menuitem"]');
        menuItems.forEach((menuItem, index) => {
            menuItem.addEventListener('keyup', (event) => {
                if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
                    const nextMenuItem = menuItems.item(index + 1);
                    if (nextMenuItem) {
                        nextMenuItem.focus();
                    } else{
                        menuItems.item(0).focus();
                    }
                } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
                    const previousMenuItem = menuItems.item(index - 1);
                    if (previousMenuItem) {
                        previousMenuItem.focus();
                    } else {
                        menuItems.item(menuItems.length - 1).focus();
                    }
                }
            });
        });
    }
}

function closeModalsOutsideClick(event) {
    const isModal = event.target.closest('.modal');
    if (!isModal) {
        document.querySelectorAll('.modal').forEach((modal) => {
            modal.classList.remove('modal__active');
        });
    }
}

document.addEventListener('click', closeModalsOutsideClick);

function handleNotificationModal(event) {
    event.preventDefault();
    event.stopPropagation();
    toggleModal('.alert__container');

    const alertContainer = document.querySelector('.alert__container');
    const isExpanded = notification.attributes['aria-expanded'].value === 'true';

    notification.ariaExpanded = isExpanded ? 'false' : 'true';
    if(isExpanded) alertContainer.focus();
}

const notification = document.querySelector('.app__navbar__actions .notification__container');
notification.addEventListener('click', handleNotificationModal);

function handleProfileModal(event) {
    event.preventDefault();
    event.stopPropagation();
    toggleModal('.profile__container');

    const allMenuItems = document.querySelectorAll('.profile__container [role="menuitem"]');

    //Attach a redirect to all menu items
    allMenuItems.forEach((menuItem)=>{
        menuItem.addEventListener('click', (e)=>{
            window.open("", '_blank');
        })
    })

    const isExpanded = nameTag.attributes['aria-expanded'].value === 'true';
    nameTag.ariaExpanded = isExpanded ? 'false' : 'true';
    isExpanded ? nameTag.focus() : allMenuItems.item(0).focus();
}

const nameTag = document.querySelector('.app__navbar__actions .name__tag');
nameTag.addEventListener('click', handleProfileModal);

function handleContentArticleToggle(event) {
    event.preventDefault();

    const article = event.currentTarget;
    const isActive = article.classList.contains('article__active');

    // Close all articles
    document.querySelectorAll('.app__content_body > article.article__active').forEach((otherArticle) => {
        if (otherArticle !== article) {
            otherArticle.classList.remove('article__active');
        }
    });

    // Toggle the clicked article only if it wasn't already active
    if (!isActive) {
        article.classList.add('article__active');
    }
}

// Handle the toggle of the content
const contentArticles = document.querySelectorAll('.app__content_body > article');
contentArticles.forEach((article) => {
    article.addEventListener('click', handleContentArticleToggle);
});

function handleAccordionToggle(event) {
    event.preventDefault();
    event.stopPropagation();
    accordion.classList.toggle('accordion__active');
    accordionBtn.classList.toggle('accordionBtn__active');
}

// Handle the toggle of the general accordion
const accordion = document.querySelector('.app__content_body');
const accordionBtn = document.querySelector('.app__content_header-right button');

accordionBtn.addEventListener('click', handleAccordionToggle);
accordionBtn.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        handleAccordionToggle(event);
    }
});
function handleBannerClose() {
    const banner = document.querySelector('.app__banner');
    banner.classList.add('banner__hidden');
}

// Remove Banner
const bannerCloseBtns = document.querySelectorAll('.cancel__button__container');
bannerCloseBtns.forEach((bannerCloseBtn) => {
    bannerCloseBtn.addEventListener('click', handleBannerClose);
});

function handleCheckBoxToggle(event, index) {
    event.preventDefault();

    const container = event.currentTarget;
    const checkBoxInitialState = container.querySelector('svg.base_state');
    const checkBoxLoadingState = container.querySelector('svg.loading_state');
    const checkBoxFinalState = container.querySelector('svg.final_state');
    const textContentForTask = container.parentNode.querySelector('h4').textContent;
    const allSteps = document.querySelectorAll('.app__content_body > article');

    // Check if loading state is visible
    const isFinalStateVisible = checkBoxFinalState.classList.contains('d-block');

    // Function to show loading state for 2 seconds and then switch to final state
    const showLoadingState = () => {
        container.attributes['aria-label'].value = 'Loading';
        checkBoxInitialState.classList.remove('d-block');
        checkBoxInitialState.classList.add('d-none');
        checkBoxLoadingState.classList.remove('d-none');
        checkBoxLoadingState.classList.add('d-block');

        // Set timeout to switch to final state after 2 seconds
        setTimeout(() => {
            container.attributes['aria-label'].value = `${textContentForTask} marked done`;
            checkBoxLoadingState.classList.remove('d-block');
            checkBoxLoadingState.classList.add('d-none');
            checkBoxFinalState.classList.remove('d-none');
            checkBoxFinalState.classList.add('d-block');

            // Update progress bar
            itemsClicked++;
            updateProgressBar();

            //Close current article and open next article
            allSteps[index].classList.remove('article__active');
            if ((index + 1) <= allSteps.length - 1) {
                allSteps[index + 1].classList.add('article__active');
            };
        }, 500);
    };

    // Function to reset to base state
    const resetToBaseState = () => {
        checkBoxInitialState.classList.remove('d-none');
        checkBoxLoadingState.classList.remove('d-block');
        checkBoxFinalState.classList.remove('d-block');

        checkBoxLoadingState.classList.add('d-none');
        checkBoxFinalState.classList.add('d-none');

        container.attributes['aria-label'].value = `${textContentForTask} marked not done`;
        // Reduce the width of the progress bar
        if (itemsClicked > 0) {
            itemsClicked--;
            updateProgressBar();
        }
    };

    // Toggle states based on current visibility
    isFinalStateVisible ? resetToBaseState() : showLoadingState();
}

// Handle the checkbox toggle
const checkBoxContainers = document.querySelectorAll('.app__content_article_header button');
const progressBar = document.querySelector('.progress-bar__inner');
const completionCountSpan = document.querySelector('.progress-bar__container span');
let itemsClicked = 0;

checkBoxContainers.forEach((container, index) => {
    container.addEventListener('click', function (event) {
        handleCheckBoxToggle(event, index);
    });
});

function updateProgressBar() {
    const progressBarWidth = (itemsClicked / checkBoxContainers.length) * 100;
    progressBar.style.width = `${progressBarWidth}%`;

    // Update completion count
    completionCountSpan.textContent = `${itemsClicked} / ${checkBoxContainers.length} completed`;

    // Check if all checkboxes are checked
    itemsClicked === checkBoxContainers.length
        ? progressBar.classList.add('progressed')
        : progressBar.classList.remove('progressed');
}
