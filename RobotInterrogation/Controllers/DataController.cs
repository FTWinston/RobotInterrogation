using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using RobotInterrogation.Models;
using RobotInterrogation.Services;

namespace RobotInterrogation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DataController : Controller
    {
        [HttpGet("[action]")]
        public string GetNextSessionID([FromServices] GameInstanceService service)
        {
            return service.GetNewGameInstanceID();
        }

        [HttpGet("[action]")]
        public IEnumerable<Packet> ListPackets([FromServices] IOptions<GameConfiguration> configuration)
        {
            return configuration.Value.Packets;
        }
    }
}
