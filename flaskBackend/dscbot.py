# Finished discord bot program; Not connected to server yet

from pathlib import Path
import discord
import os
from dotenv import load_dotenv
import time

load_dotenv()

CHANNEL_ID = 1309601282075398195        # laundry channel id
NOTIFILE = "./NOTIFILE"
MSG_FROM_SERVER = "./MSG"

client = discord.Client()
token = os.getenv("TOKEN")


@client.event
async def on_ready():
    print("Logged in as a bot! {0}".format(client))
    
async def send_message_to_channel(message):
    await client.wait_until_ready()
    channel = client.get_channel(CHANNEL_ID)
    
    tobesent = ""
    lis = message.split()
    for i in range(0, len(lis), 2):
        if len(lis[i]) >4:
            continue

        name = ""
        if lis[i][0] == 'W':
            name = "Washer "+lis[i][1:]
        if lis[i][0] == 'D':
            name = "Dryer "+lis[i][1:]
        tobesent += name+" "+lis[i+1]+"\n"
            
    await channel.send(tobesent)

async def check_notification():
    while True:
        time.sleep(0.2)
        if Path(NOTIFILE).exists() == False:
            continue
        os.remove(NOTIFILE)
        with open(MSG_FROM_SERVER, "r") as fin:
            msg = fin.read()
        send_message_to_channel(msg)

if __name__ == "__main__":
    client.loop.create_task(check_notification())
    client.run(token)