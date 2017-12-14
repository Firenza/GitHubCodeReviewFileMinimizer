$('div .file-header').each(function (index) {

    let fileName = $(this).find('div.file-info').find('a').attr('title');
    console.log(fileName);

    if (fileName.endsWith('.csproj') || fileName.endsWith('.sln') || fileName.endsWith('packages.config')){
        $(this).find('button').click();
    }
   
});