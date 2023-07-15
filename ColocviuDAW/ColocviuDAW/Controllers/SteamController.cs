using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Linq;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Web;
using AspNet.Security.OpenId;
using ColocviuDAW.Extensions;
using ColocviuDAW.Models;
using System.Data;
using System.Net;

namespace ColocviuDAW.Controllers
{
    [Route("api/steam")]
    [ApiController]
    public class SteamController : Controller
    {
        private string steamKey = "35FE52E19D7EF36461E3E9DFB3D8B931";
        private string steamApiLink = "http://api.steampowered.com/";
        private string steamStoreApiLink = "http://store.steampowered.com/api/";

        [HttpGet("steamTest")]
        public IActionResult SteamTest()
        {
            using (HttpClient client = new HttpClient())
            {
                HttpResponseMessage raspuns = client.GetAsync(steamApiLink + "ISteamNews/GetNewsForApp/v0002/?appid=1184370&count=3&maxlength=300&format=json").Result;
                string stringData = raspuns.Content.ReadAsStringAsync().Result;
                dynamic json = JsonConvert.DeserializeObject(stringData);
                return Ok(json);
            }
        }

        [HttpGet("steamUserProfil")]
        public IActionResult SteamUserProfil(string steamId)
        {
            using (HttpClient client = new HttpClient())
            {
                HttpResponseMessage raspuns = client.GetAsync(steamApiLink + "ISteamUser/GetPlayerSummaries/v0002/?key=" + steamKey + "&steamids=" + steamId).Result;
                string stringData = raspuns.Content.ReadAsStringAsync().Result;
                
                //stringData = stringData.Remove(14, 12);
                //stringData = stringData.Remove(stringData.Length - 3, 2);
                dynamic json = JsonConvert.DeserializeObject(stringData);
                return Ok(json);
            }
        }

        [HttpGet("getSteamJocStore")]
        public IActionResult Store(string appId)
        {
            Console.WriteLine(appId);
            using (HttpClient client = new HttpClient())
            {
                HttpResponseMessage raspuns = client.GetAsync(steamStoreApiLink + "appdetails?appids=" + appId + "&l=romanian").Result;
                string stringData = raspuns.Content.ReadAsStringAsync().Result;
                Console.WriteLine(stringData);

                dynamic json = JsonConvert.DeserializeObject(stringData);
                return Ok(json[appId].data);        
            }
        }

        [HttpGet("getJocUserSteam")]
        public IActionResult JocUserSteam(string steamId)
        {
            //Timp jucat de la Steam in minute nu ore
            //Limita de o ora diferenta si nr ore Steam > nr ore site => OK
            using (HttpClient client = new HttpClient())
            {
                HttpResponseMessage raspuns = client.GetAsync(steamApiLink + "IPlayerService/GetOwnedGames/v1/?key=" + steamKey + "&steamid=" + steamId).Result;
                string stringData = raspuns.Content.ReadAsStringAsync().Result;
                Console.WriteLine(stringData);

                dynamic json = JsonConvert.DeserializeObject(stringData);
                return Ok(json.raspuns.games);
            }
        }

        [HttpGet("getNrRealizari")]
        public IActionResult GetNrRealizari(string steamId, string appId)
        {
            using (HttpClient client = new HttpClient())
            {
                HttpResponseMessage raspuns = client.GetAsync(steamApiLink + "ISteamUserStats/GetPlayerAchievements/v1/?key=" + steamKey + "&steamid=" + steamId + "&appid=" + appId).Result;
                string stringData = raspuns.Content.ReadAsStringAsync().Result;
                Console.WriteLine(stringData);

                dynamic json = JsonConvert.DeserializeObject(stringData);
                return Ok(json.playerstats.achievements);
            }
        }
    }
}
