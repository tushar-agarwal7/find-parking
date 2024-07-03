const Blog=require("../../models/blog")

(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()



  let btn=document.querySelector("button");

btn.addEventListener("click", async()=>{
  console.log("chl rha")
  let dest=document.querySelector("input").value;
  let destArr=await getDestination(dest);

})

async function getDestination(dest){
  const results = await Blog.find({ $text: { $search: query } });

  if (results.length === 0) {
      req.flash("error", "No matching blogs found");
      res.redirect("/home");
  } else {
      res.render("listings/searchResults.ejs", { results });
  }
}

