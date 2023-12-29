


const pageSection = (options) => `
    <div id="${options.id}" class="${options.cssClass || 'right ofHidden lightBorder opacDarkBackground seperator seperatorLeft fleetRight'}"> 
        <div class="header border">
            <img src="/images/buttons/construction.png" class="icon" width="28" height="29">
            ${options.title}
        </div> 
        ${options.content}                    
    </div>
`;