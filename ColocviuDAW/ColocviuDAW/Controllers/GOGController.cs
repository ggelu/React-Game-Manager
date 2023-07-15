using ColocviuDAW.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace ColocviuDAW.Controllers
{
    [Route("api/gog")]
    [ApiController]
    public class GOGController : Controller
    {
        private string gogApiLink = "http://api.steampowered.com/";
        //private string gogStoreApiLink = "http://api.gog.com/";
        private string gogStoreApiLink = "http://embed.gog.com/games/ajax/filtered?mediaType=game&search=";

        [HttpGet("getGogJocStore")]
        public IActionResult GetGogJocStore(string jocName, string jocId)
        {
            using (HttpClient client = new HttpClient())
            {
                HttpResponseMessage raspuns = client.GetAsync(gogStoreApiLink + jocName).Result;
                string stringData = raspuns.Content.ReadAsStringAsync().Result;
                dynamic json = JsonConvert.DeserializeObject(stringData);
                var list = new List<dynamic>(json.products);
                return Ok(list.Find(x => x.id == jocId));
            }
        }
    }
}
