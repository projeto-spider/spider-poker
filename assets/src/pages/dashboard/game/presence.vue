<template>
  <div>
    <div class="list-label">Presence</div>

    <transition-group name="user-presence">
      <div v-for="user in online" v-if="user" :key="user.id" class="item">
        <gravatar :email="user.email" :circle="true" class="item-primary"></gravatar>
        <div class="item-content has-secondary">{{user.name}}</div>

        <template>
          <i
            v-if="voting && votes.includes(user.id)"
            class="item-secondary"
          >
            done
          </i>

          <template v-else-if="discussion && votes[user.id]">
            <i v-if="votes[user.id] === 'time'" class="item-secondary">
              access_time
            </i>

            <span v-else class="item-secondary">
              {{votes[user.id]}}
            </span>
          </template>
        </template>
      </div>
    </transition-group>

    <transition-group name="user-presence">
      <div v-for="user in offline" v-if="user" :key="user.id" class="item item-offline">
        <avatar :user="user" :circle="true" class="item-primary"></avatar>
        <div class="item-content has-secondary">{{user.name}}</div>
      </div>
    </transition-group>
  </div>
</template>

<script src="./presence.js"></script>
<style lang="sass" src="./presence.sass"></style>
