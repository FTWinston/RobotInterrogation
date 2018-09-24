using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using RobotInterrogation.Models;
using RobotInterrogation.Services;

namespace RobotInterrogation.Controllers
{
    [Route("api/[controller]")]
    public class DataController : Controller
    {
        [HttpGet("[action]")]
        public string GetNextSessionID([FromServices] InterviewService service)
        {
            return service
                .GetNextSessionID()
                .ToString();
        }

        [HttpGet("[action]")]
        public IEnumerable<Packet> ListPackets()
        {
            // TODO: can these be stored in a config file?
            throw new NotImplementedException();
        }
    }
}
